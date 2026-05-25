import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const SUM_FIELDS = [
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

function parseInning(inn: string) {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

function aggregateByName(rows: any[]) {
  const playerMap: Record<string, any[]> = {};
  for (const row of rows) {
    (playerMap[row.name] ??= []).push(row);
  }
  return Object.entries(playerMap).map(([name, records]) => {
    const total: Record<string, number> = {};
    for (const field of SUM_FIELDS) {
      total[field] = records.reduce(
        (acc, cur) => acc + Number(cur[field] ?? 0),
        0,
      );
    }
    const totalInnings = records.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );
    const era = totalInnings ? (total['earnedruns'] * 9) / totalInnings : 0;
    const whip = totalInnings
      ? (total['hits'] + total['walks']) / totalInnings
      : 0;
    const winrate =
      total['wins'] + total['losses'] > 0
        ? total['wins'] / (total['wins'] + total['losses'])
        : 0;
    const opponent_avg = total['atbats']
      ? total['hits'] / total['atbats']
      : 0;
    const strikeout_rate = total['batters']
      ? (total['strikeouts'] / total['batters']) * 100
      : 0;
    return {
      name,
      back_number: records[0]?.back_number ?? null,
      season: records[0]?.season ?? null,
      ...total,
      innings: totalInnings.toFixed(1),
      era: era.toFixed(2),
      whip: whip.toFixed(3),
      winrate: winrate.toFixed(3),
      opponent_avg: opponent_avg.toFixed(3),
      strikeout_rate: strikeout_rate.toFixed(3),
    };
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerName = searchParams.get('name');
  const season = searchParams.get('season');
  const league = searchParams.get('league');

  if (playerName) {
    let query = supabase
      .from('pitcher_stats')
      .select('*')
      .eq('name', playerName);
    if (league) query = query.eq('league', league);
    const { data, error } = await query.order('season', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ seasonStats: data });
  }

  if (season) {
    let query = supabase
      .from('pitcher_stats')
      .select('*')
      .eq('season', season);
    if (league) {
      query = query.eq('league', league);
      const { data, error } = await query
        .order('earnedruns', { ascending: true })
        .order('hits', { ascending: true });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ seasonStats: data });
    }
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const aggregated = aggregateByName(data ?? []);
    aggregated.sort(
      (a: any, b: any) => Number(a.era ?? 0) - Number(b.era ?? 0),
    );
    return NextResponse.json({ seasonStats: aggregated });
  }

  return NextResponse.json(
    { error: 'Missing player name or season' },
    { status: 400 },
  );
}
