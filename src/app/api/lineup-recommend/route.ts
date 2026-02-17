import { supabase } from '@/lib/supabase';
import type { LineupRecommendResponse } from '@/types/lineup';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY! });
}

const MIN_AT_BATS = 30;

const SYSTEM_PROMPT = `당신은 한국 사회인 야구팀 "담장NUMUGAS"의 감독입니다.
선수들의 시즌 성적 데이터를 분석하여 최적의 9인 타순과 선발투수를 추천합니다.

중요: 모든 텍스트(reasoning, overallReasoning 포함)는 반드시 한국어로만 작성하세요. 일본어, 영어 등 다른 언어를 절대 사용하지 마세요.

## 현대 야구 타순 편성 원칙 (세이버메트릭스 기반)
- 1번 타자: 높은 출루율(OBP)이 핵심. 출루율이 가장 높은 선수. 도루 능력은 부가 요소.
- 2번 타자: 팀 최고의 타자. OPS(출루율+장타율)가 가장 높은 선수를 배치. 현대 야구에서 2번 타자는 가장 많은 타석 기회 + 주자가 있는 상황이 많아 최고 타자가 배치됨.
- 3번 타자: 높은 OPS를 가진 타자. 장타율과 타점 능력이 뛰어난 선수.
- 4번 타자: 장타력(홈런, 타점)이 뛰어난 클린업 타자.
- 5번 타자: 장타력과 타점 능력이 있는 타자.
- 6~7번 타자: 중간 수준의 타격 능력을 가진 선수.
- 8~9번 타자: 상대적으로 타격 능력이 낮은 선수.
- 핵심 지표 우선순위: OPS > 출루율 > 타율 > 장타율

## 규칙
- 9명의 타순 + 1명의 선발투수를 구성할 것
- 선발투수는 타순에 포함하지 않음 (별도로 선발투수 지정)
- 포지션은 추천하지 않음 (타순, 이름, 등번호, 배치 이유만 제공)
- 배치 이유는 구체적인 성적 수치를 인용하여 한국어로 설명할 것

## 응답 형식
반드시 아래 JSON 형식만 응답하세요. JSON 외 다른 텍스트를 절대 포함하지 마세요.
{
  "lineup": [
    { "battingOrder": 1, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 2, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 3, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 4, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 5, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 6, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 7, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 8, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" },
    { "battingOrder": 9, "name": "선수이름", "number": "등번호", "reasoning": "배치 이유를 한국어로 작성" }
  ],
  "startingPitcher": { "name": "투수이름", "number": "등번호", "reasoning": "선발 이유를 한국어로 작성" },
  "overallReasoning": "전체 라인업 전략을 한국어로 설명",
  "seasonUsed": 2026
}`;

export async function POST() {
  try {
    // 1. Supabase에서 선수 목록 fetch
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, number, position');

    if (playersError) {
      return NextResponse.json(
        { error: '선수 목록을 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    // 2. 타자 기록 fetch (2026 시즌 우선, 없으면 2025 fallback)
    let batterSeason = 2026;
    let { data: batterStats, error: batterError } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('season', 2026);

    if (batterError) {
      return NextResponse.json(
        { error: '타자 기록을 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    if (!batterStats || batterStats.length === 0) {
      batterSeason = 2025;
      const result = await supabase
        .from('batter_stats')
        .select('*')
        .eq('season', 2025);
      batterStats = result.data;
      if (result.error) {
        return NextResponse.json(
          { error: '타자 기록을 불러오지 못했습니다.' },
          { status: 500 },
        );
      }
    }

    // 3. 투수 기록 fetch (동일 시즌)
    let { data: pitcherStats, error: pitcherError } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('season', batterSeason);

    if (pitcherError) {
      return NextResponse.json(
        { error: '투수 기록을 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    if (!pitcherStats || pitcherStats.length === 0) {
      const fallbackSeason = batterSeason === 2026 ? 2025 : 2025;
      const result = await supabase
        .from('pitcher_stats')
        .select('*')
        .eq('season', fallbackSeason);
      pitcherStats = result.data;
    }

    // 4. 유저 프롬프트 구성
    const playerList = (players ?? [])
      .map((p) => `- ${p.name} (등번호: ${p.number}, 포지션: ${p.position})`)
      .join('\n');

    const qualifiedBatters = (batterStats ?? []).filter(
      (b) => Number(b.atbats) >= MIN_AT_BATS,
    );

    const batterList = qualifiedBatters
      .map((b) => {
        const obp = Number(b.onbasepercentage) || 0;
        const slg = Number(b.sluggingpercentage) || 0;
        const ops = (obp + slg).toFixed(3);
        return (
          `- ${b.name}: OPS ${ops}, 출루율 ${b.onbasepercentage}, 장타율 ${b.sluggingpercentage}, ` +
          `타율 ${b.avg}, 안타 ${b.hits}, 홈런 ${b.homeruns}, 타점 ${b.rbi}, 도루 ${b.stolenbases}, ` +
          `경기 ${b.games}, 타수 ${b.atbats}`
        );
      })
      .join('\n');

    const pitcherList = (pitcherStats ?? [])
      .map(
        (p) =>
          `- ${p.name}: 이닝 ${p.innings}, 승 ${p.wins}, 패 ${p.losses}, ` +
          `자책점 ${p.earnedruns}, 탈삼진 ${p.strikeouts}, 피안타 ${p.hits}, ` +
          `볼넷 ${p.walks}, 경기 ${p.games}`,
      )
      .join('\n');

    const userPrompt = `아래는 ${batterSeason} 시즌 선수 데이터입니다. 최적의 9인 타순과 선발투수를 추천해주세요.
타자 기록은 ${MIN_AT_BATS}타석 이상 출전한 선수만 포함되어 있습니다.

## 선수 명단
${playerList}

## 타자 기록 (${batterSeason} 시즌, ${MIN_AT_BATS}타수 이상)
${batterList || '기록 없음'}

## 투수 기록 (${batterSeason} 시즌)
${pitcherList || '기록 없음'}`;

    // 5. Groq API 호출
    const completion = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: 'AI 응답이 비어 있습니다.' },
        { status: 500 },
      );
    }

    // 6. JSON 파싱
    const result: LineupRecommendResponse = JSON.parse(text.trim());

    // 7. 검증
    if (!result.lineup || result.lineup.length !== 9) {
      return NextResponse.json(
        { error: 'AI가 9명의 라인업을 생성하지 못했습니다.' },
        { status: 500 },
      );
    }

    if (!result.startingPitcher) {
      return NextResponse.json(
        { error: 'AI가 선발투수를 지정하지 못했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Lineup recommendation error:', error);
    return NextResponse.json(
      { error: 'AI 라인업 추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
