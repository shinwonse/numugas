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

function aggregateBatterCareer(rows: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const row of rows) {
    (grouped[row.name] ??= []).push(row);
  }
  return Object.entries(grouped).map(([name, records]) => {
    const total: Record<string, number> = {};
    for (const f of BATTER_SUM_FIELDS) {
      total[f] = records.reduce((acc, cur) => acc + (Number(cur[f]) || 0), 0);
    }
    const avg = total.atbats ? total.hits / total.atbats : 0;
    const obpDen =
      total.atbats + total.walks + total.hitbypitch + total.sacrificeflies;
    const obp = obpDen
      ? (total.hits + total.walks + total.hitbypitch) / obpDen
      : 0;
    const slg = total.atbats ? total.totalbases / total.atbats : 0;
    return {
      name,
      ...total,
      avg: avg.toFixed(3),
      onbasepercentage: obp.toFixed(3),
      sluggingpercentage: slg.toFixed(3),
    };
  });
}

function aggregatePitcherCareer(rows: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const row of rows) {
    (grouped[row.name] ??= []).push(row);
  }
  return Object.entries(grouped).map(([name, records]) => {
    const total: Record<string, number> = {};
    for (const f of PITCHER_SUM_FIELDS) {
      total[f] = records.reduce((acc, cur) => acc + (Number(cur[f]) || 0), 0);
    }
    const totalInnings = records.reduce(
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
    return {
      name,
      ...total,
      innings: formatInning(totalInnings),
      era: era.toFixed(2),
      whip: whip.toFixed(3),
      winrate: winrate.toFixed(3),
      opponent_avg: opponent_avg.toFixed(3),
      strikeout_rate: strikeout_rate.toFixed(3),
    };
  });
}

export const fetchBattingStatsBySeason = unstable_cache(
  async (season: string | undefined, league: string | undefined) => {
    const leagueFilter = league || OVERALL_LEAGUE;

    if (!season) {
      const { data, error } = await supabase
        .from('batter_stats')
        .select('*')
        .eq('league', leagueFilter);
      if (error) return [];
      return aggregateBatterCareer(data ?? []);
    }

    const { data, error } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('season', season)
      .eq('league', leagueFilter)
      .order('avg', { ascending: false });
    if (error) return [];
    return data ?? [];
  },
  ['batting-stats-by-season'],
  { revalidate: 300, tags: ['stats'] },
);

export const fetchPitchingStatsBySeason = unstable_cache(
  async (season: string | undefined, league: string | undefined) => {
    const leagueFilter = league || OVERALL_LEAGUE;

    if (!season) {
      const { data, error } = await supabase
        .from('pitcher_stats')
        .select('*')
        .eq('league', leagueFilter);
      if (error) return [];
      return aggregatePitcherCareer(data ?? []);
    }

    const { data, error } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('season', season)
      .eq('league', leagueFilter)
      .order('earnedruns', { ascending: true })
      .order('hits', { ascending: true });
    if (error) return [];
    return data ?? [];
  },
  ['pitching-stats-by-season'],
  { revalidate: 300, tags: ['stats'] },
);
