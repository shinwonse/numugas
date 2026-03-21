import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { number: string } },
) {
  const { number } = await params;
  const playerNumber = parseInt(number);

  const { data: seasonStats, error: seasonError } = await supabase
    .from('pitcher_stats')
    .select('*')
    .eq('back_number', playerNumber)
    .order('season', { ascending: true });

  if (seasonError) {
    return NextResponse.json({ error: seasonError.message }, { status: 500 });
  }

  if (!seasonStats || seasonStats.length === 0) {
    return NextResponse.json({
      seasonStats: [],
      careerStats: null,
    });
  }

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
    total[field] = seasonStats.reduce(
      (acc, cur) => acc + Number(cur[field] ?? 0),
      0,
    );
  }

  function parseInning(inn: string) {
    if (!inn) return 0;
    const [whole, frac] = String(inn).split('.');
    return Number(whole) + (frac ? Number(frac) / 3 : 0);
  }

  const totalInnings = seasonStats.reduce(
    (acc, cur) => acc + parseInning(cur.innings),
    0,
  );

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

  const careerStats = {
    number: playerNumber,
    name: seasonStats[0]?.name || '',
    ...total,
    innings: totalInnings.toFixed(1),
    era: era.toFixed(2),
    whip: whip.toFixed(3),
    winrate: winrate.toFixed(3),
    opponent_avg: opponent_avg.toFixed(3),
    strikeout_rate: strikeout_rate.toFixed(1),
  };

  return NextResponse.json({ seasonStats, careerStats });
}
