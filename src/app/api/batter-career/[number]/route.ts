import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { number: string } },
) {
  const { number } = await params;
  const playerNumber = parseInt(number);

  console.log('Searching for player number:', playerNumber);

  // 테이블 존재 여부와 첫 번째 행 확인
  const { data: testData, error: testError } = await supabase
    .from('batter_stats')
    .select('*')
    .limit(1);

  console.log('Test query to check table structure:', { testData, testError });

  // 1. 연도별 기록
  const { data: seasonStats, error: seasonError } = await supabase
    .from('batter_stats')
    .select('*')
    .eq('back_number', playerNumber)
    .order('season', { ascending: true });

  console.log('Season stats result:', {
    data: seasonStats,
    error: seasonError,
    length: seasonStats?.length || 0,
  });

  if (seasonError) {
    return NextResponse.json({ error: seasonError.message }, { status: 500 });
  }

  if (!seasonStats || seasonStats.length === 0) {
    console.log('No season stats found for player number:', playerNumber);
    return NextResponse.json({
      seasonStats: [],
      careerStats: null,
      message: 'No stats found for this player',
    });
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
