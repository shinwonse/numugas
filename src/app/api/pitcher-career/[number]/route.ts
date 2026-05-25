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

function parseInning(inn: string | number | null | undefined) {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

function formatInning(decimalInnings: number): string {
  const whole = Math.floor(decimalInnings);
  const fracDec = decimalInnings - whole;
  const thirds = Math.round(fracDec * 3);
  if (thirds === 0) return `${whole}.0`;
  if (thirds === 3) return `${whole + 1}.0`;
  return `${whole}.${thirds}`;
}

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
      const innings = recs.reduce(
        (acc, cur) => acc + parseInning(cur.innings),
        0,
      );
      const era = innings ? (total.earnedruns * 9) / innings : 0;
      const whip = innings ? (total.walks + total.hits) / innings : 0;
      const winrate =
        total.wins + total.losses > 0
          ? total.wins / (total.wins + total.losses)
          : 0;
      const opponent_avg = total.atbats ? total.hits / total.atbats : 0;
      const strikeout_rate = total.batters
        ? (total.strikeouts / total.batters) * 100
        : 0;
      return {
        season: Number(season),
        back_number: recs[0]?.back_number ?? null,
        name: recs[0]?.name ?? '',
        ...total,
        innings: formatInning(innings),
        era: era.toFixed(2),
        whip: whip.toFixed(3),
        winrate: winrate.toFixed(3),
        opponent_avg: opponent_avg.toFixed(3),
        strikeout_rate: strikeout_rate.toFixed(1),
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
    .from('pitcher_stats')
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
  const totalInnings = rawStats.reduce(
    (acc, cur) => acc + parseInning(cur.innings),
    0,
  );
  const era = totalInnings ? (total.earnedruns * 9) / totalInnings : 0;
  const whip = totalInnings
    ? (total.walks + total.hits) / totalInnings
    : 0;
  const winrate =
    total.wins + total.losses > 0
      ? total.wins / (total.wins + total.losses)
      : 0;
  const opponent_avg = total.atbats ? total.hits / total.atbats : 0;
  const strikeout_rate = total.batters
    ? (total.strikeouts / total.batters) * 100
    : 0;

  const careerStats = {
    number: playerNumber,
    name: rawStats[0]?.name || '',
    ...total,
    innings: formatInning(totalInnings),
    era: era.toFixed(2),
    whip: whip.toFixed(3),
    winrate: winrate.toFixed(3),
    opponent_avg: opponent_avg.toFixed(3),
    strikeout_rate: strikeout_rate.toFixed(1),
  };

  return NextResponse.json({ seasonStats, careerStats });
}
