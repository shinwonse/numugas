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

function aggregateBySeason(rows: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const row of rows) {
    (grouped[row.season] ??= []).push(row);
  }
  return Object.entries(grouped)
    .map(([season, recs]) => {
      const total: Record<string, number> = {};
      for (const f of SUM_FIELDS) {
        total[f] = recs.reduce(
          (acc, cur) => acc + (Number(cur[f]) || 0),
          0,
        );
      }
      const avg = total.atbats ? total.hits / total.atbats : 0;
      const obpDen =
        total.atbats + total.walks + total.hitbypitch + total.sacrificeflies;
      const obp = obpDen
        ? (total.hits + total.walks + total.hitbypitch) / obpDen
        : 0;
      const slg = total.atbats ? total.totalbases / total.atbats : 0;
      return {
        season: Number(season),
        back_number: recs[0]?.back_number ?? null,
        name: recs[0]?.name ?? '',
        ...total,
        avg: avg.toFixed(3),
        onbasepercentage: obp.toFixed(3),
        sluggingpercentage: slg.toFixed(3),
      };
    })
    .sort((a, b) => a.season - b.season);
}

export async function GET(
  req: Request,
  { params }: { params: { number: string } },
) {
  const { number } = await params;
  const playerNumber = parseInt(number);

  const { data: rawStats, error: seasonError } = await supabase
    .from('batter_stats')
    .select('*')
    .eq('back_number', playerNumber)
    .order('season', { ascending: true });

  if (seasonError) {
    return NextResponse.json({ error: seasonError.message }, { status: 500 });
  }

  if (!rawStats || rawStats.length === 0) {
    return NextResponse.json({
      seasonStats: [],
      careerStats: null,
      message: 'No stats found for this player',
    });
  }

  const seasonStats = aggregateBySeason(rawStats);

  const total: Record<string, number> = {};
  for (const f of SUM_FIELDS) {
    total[f] = rawStats.reduce(
      (acc, cur) => acc + (Number(cur[f]) || 0),
      0,
    );
  }
  const avg = total.atbats ? total.hits / total.atbats : 0;
  const obpDen =
    total.atbats + total.walks + total.hitbypitch + total.sacrificeflies;
  const obp = obpDen
    ? (total.hits + total.walks + total.hitbypitch) / obpDen
    : 0;
  const slg = total.atbats ? total.totalbases / total.atbats : 0;

  const careerStats = {
    number: playerNumber,
    name: rawStats[0]?.name || '',
    ...total,
    avg: avg.toFixed(3),
    onbasepercentage: obp.toFixed(3),
    sluggingpercentage: slg.toFixed(3),
  };

  return NextResponse.json({ seasonStats, careerStats });
}
