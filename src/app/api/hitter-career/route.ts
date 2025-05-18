import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerName = searchParams.get('name');

  // 시즌별 기록 조회 API: /api/hitter-career/season?name=...
  if (playerName) {
    // 해당 선수의 시즌별 기록 조회
    const { data, error } = await supabase
      .from('hitter_stats')
      .select('*')
      .eq('name', playerName)
      .order('season', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ seasonStats: data });
  }

  // 1. 모든 시즌 데이터 조회
  const { data, error } = await supabase.from('hitter_stats').select('*');
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
      'plateappearances',
      'atbats',
      'runs',
      'hits',
      'singles',
      'doubles',
      'triples',
      'homeruns',
      'totalbases',
      'rbi',
      'stolenbases',
      'caughtstealing',
      'sacrificehits',
      'sacrificeflies',
      'walks',
      'intentionalwalks',
      'hitbypitch',
      'strikeouts',
      'doubleplays',
    ];
    const total: Record<string, number> = {};
    for (const field of sumFields) {
      total[field] = records.reduce(
        (acc, cur) => acc + Number(cur[field] ?? 0),
        0,
      );
    }
    // 타율, 출루율, 장타율 계산
    const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
    const onbase =
      total['atbats'] +
      total['walks'] +
      total['hitbypitch'] +
      total['sacrificeflies'];
    const onbasepercentage = onbase
      ? (total['hits'] + total['walks'] + total['hitbypitch']) / onbase
      : 0;
    const sluggingpercentage = total['atbats']
      ? total['totalbases'] / total['atbats']
      : 0;

    return {
      name,
      ...total,
      avg: avg.toFixed(3),
      onbasepercentage: onbasepercentage.toFixed(3),
      sluggingpercentage: sluggingpercentage.toFixed(3),
    };
  });

  return NextResponse.json({ careerStats });
}
