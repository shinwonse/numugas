import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  // 1. 모든 시즌 데이터 조회
  const { data, error } = await supabase.from('pitcher_stats').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. 선수별로 그룹화 및 통산 집계
  const playerMap: Record<string, any[]> = {};
  for (const row of data ?? []) {
    if (!playerMap[row.name]) playerMap[row.name] = [];
    playerMap[row.name].push(row);
  }

  // 3. 통산 기록 계산
  const careerStats = Object.entries(playerMap).map(([name, records]) => {
    // 합산용 숫자 필드
    const sumFields = [
      'games',
      'wins',
      'losses',
      'saves',
      'holds',
      'batters',
      'atbats',
      'pitches',
      'hits',
      'homeruns',
      'sacrificehits',
      'sacrificeflies',
      'walks',
      'intentionalwalks',
      'hitbypitch',
      'strikeouts',
      'wildpitches',
      'balks',
      'runs',
      'earnedruns',
    ];
    const total: Record<string, number> = {};
    for (const field of sumFields) {
      total[field] = records.reduce(
        (acc, cur) => acc + Number(cur[field] ?? 0),
        0,
      );
    }

    // 이닝 합산 (ex: "12.2" -> 12 + 2/3)
    function parseInning(inn: string) {
      if (!inn) return 0;
      const [whole, frac] = String(inn).split('.');
      return Number(whole) + (frac ? Number(frac) / 3 : 0);
    }
    const totalInnings = records.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );

    // ERA, WHIP, 승률, 피안타율, 탈삼진율 계산
    const era = totalInnings ? (total['earnedruns'] * 9) / totalInnings : 0;
    const whip = totalInnings
      ? (total['walks'] + total['hits']) / totalInnings
      : 0;
    const winrate =
      total['wins'] + total['losses'] > 0
        ? total['wins'] / (total['wins'] + total['losses'])
        : 0;
    const opponent_avg =
      total['atbats'] > 0 ? total['hits'] / total['atbats'] : 0;
    const strikeout_rate =
      total['batters'] > 0 ? (total['strikeouts'] / total['batters']) * 100 : 0;

    return {
      name,
      ...total,
      innings: totalInnings.toFixed(1),
      era: era.toFixed(3),
      whip: whip.toFixed(3),
      winrate: winrate.toFixed(3),
      opponent_avg: opponent_avg.toFixed(3),
      strikeout_rate: strikeout_rate.toFixed(3),
    };
  });

  return NextResponse.json({ careerStats });
}
