import { formatInning, parseInning } from '@/lib/inning';
import { OVERALL_LEAGUE } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';

const BATTER_SUM_FIELDS = [
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

const PITCHER_SUM_FIELDS = [
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

function aggregateBatterBySeason(rows: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const row of rows) {
    (grouped[row.season] ??= []).push(row);
  }
  return Object.entries(grouped)
    .map(([season, recs]) => {
      const total: Record<string, number> = {};
      for (const f of BATTER_SUM_FIELDS) {
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

function aggregatePitcherBySeason(rows: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const row of rows) {
    (grouped[row.season] ??= []).push(row);
  }
  return Object.entries(grouped)
    .map(([season, recs]) => {
      const total: Record<string, number> = {};
      for (const f of PITCHER_SUM_FIELDS) {
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

export const fetchBatterCareerByNumber = unstable_cache(
  async (number: string) => {
    const { data, error } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('back_number', number)
      .eq('league', OVERALL_LEAGUE)
      .order('season', { ascending: true });

    if (error || !data || data.length === 0) {
      return { seasonStats: [], careerStats: null };
    }

    const seasonStats = aggregateBatterBySeason(data);
    const total: Record<string, number> = {};
    for (const f of BATTER_SUM_FIELDS) {
      total[f] = data.reduce((acc, cur) => acc + (Number(cur[f]) || 0), 0);
    }
    const avg = total.atbats ? total.hits / total.atbats : 0;
    const obpDen =
      total.atbats + total.walks + total.hitbypitch + total.sacrificeflies;
    const obp = obpDen
      ? (total.hits + total.walks + total.hitbypitch) / obpDen
      : 0;
    const slg = total.atbats ? total.totalbases / total.atbats : 0;

    const careerStats = {
      number: Number(number),
      name: data[0]?.name || '',
      ...total,
      avg: avg.toFixed(3),
      onbasepercentage: obp.toFixed(3),
      sluggingpercentage: slg.toFixed(3),
    };

    return { seasonStats, careerStats };
  },
  ['batter-career-by-number'],
  { revalidate: 300, tags: ['stats'] },
);

export const fetchPitcherCareerByNumber = unstable_cache(
  async (number: string) => {
    const { data, error } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('back_number', number)
      .eq('league', OVERALL_LEAGUE)
      .order('season', { ascending: true });

    if (error || !data || data.length === 0) {
      return { seasonStats: [], careerStats: null };
    }

    const seasonStats = aggregatePitcherBySeason(data);
    const total: Record<string, number> = {};
    for (const f of PITCHER_SUM_FIELDS) {
      total[f] = data.reduce((acc, cur) => acc + (Number(cur[f]) || 0), 0);
    }
    const totalInnings = data.reduce(
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
      number: Number(number),
      name: data[0]?.name || '',
      ...total,
      innings: formatInning(totalInnings),
      era: era.toFixed(2),
      whip: whip.toFixed(3),
      winrate: winrate.toFixed(3),
      opponent_avg: opponent_avg.toFixed(3),
      strikeout_rate: strikeout_rate.toFixed(1),
    };

    return { seasonStats, careerStats };
  },
  ['pitcher-career-by-number'],
  { revalidate: 300, tags: ['stats'] },
);
