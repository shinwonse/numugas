import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const SUM_FIELDS = [
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
      back_number: records[0]?.back_number ?? null,
      season: records[0]?.season ?? null,
      ...total,
      avg: avg.toFixed(3),
      onbasepercentage: onbasepercentage.toFixed(3),
      sluggingpercentage: sluggingpercentage.toFixed(3),
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
      .from('batter_stats')
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
      .from('batter_stats')
      .select('*')
      .eq('season', season);
    if (league) {
      query = query.eq('league', league);
      const { data, error } = await query.order('avg', { ascending: false });
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
      (a: any, b: any) => Number(b.avg ?? 0) - Number(a.avg ?? 0),
    );
    return NextResponse.json({ seasonStats: aggregated });
  }

  return NextResponse.json(
    { error: 'Missing player name or season' },
    { status: 400 },
  );
}
