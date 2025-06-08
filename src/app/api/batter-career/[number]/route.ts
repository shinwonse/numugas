import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { number: string } },
) {
  const playerNumber = parseInt(params.number);

  // 1. 연도별 기록
  const { data: seasonStats, error: seasonError } = await supabase
    .from('batter_stats')
    .select('*')
    .eq('number', playerNumber)
    .order('season', { ascending: true });

  if (seasonError) {
    return NextResponse.json({ error: seasonError.message }, { status: 500 });
  }

  // 2. 통산 기록 집계
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
    total[field] = seasonStats.reduce(
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

  const careerStats = {
    number: playerNumber,
    name: seasonStats[0]?.name || '',
    ...total,
    avg: avg.toFixed(3),
    onbasepercentage: onbasepercentage.toFixed(3),
    sluggingpercentage: sluggingpercentage.toFixed(3),
  };

  return NextResponse.json({ seasonStats, careerStats });
}
