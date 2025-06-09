import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface BatterSeasonStat {
  season: number;
  games: number;
  atbats: number;
  hits: number;
  plateappearances: number;
  runs: number;
  singles: number;
  doubles: number;
  triples: number;
  homeruns: number;
  totalbases: number;
  rbi: number;
  stolenbases: number;
  caughtstealing: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  doubleplays: number;
}

interface PitcherSeasonStat {
  season: number;
  games: number;
  era: string;
  wins: number;
  losses: number;
  saves: number;
  holds: number;
  winrate: string;
  innings: string;
  batters: number;
  atbats: number;
  pitches: number;
  hits: number;
  homeruns: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  wildpitches: number;
  balks: number;
  runs: number;
  earnedruns: number;
  whip: string;
  opponent_avg: string;
  strikeout_rate: string;
}

interface BatterCareerResponse {
  seasonStats: BatterSeasonStat[];
  careerStats: Record<string, any> | null;
}

interface PitcherCareerResponse {
  seasonStats: PitcherSeasonStat[];
  careerStats: Record<string, any> | null;
}

// 타자 통계 fetching 함수
async function fetchBatterStats(
  playerNumber: number,
): Promise<BatterCareerResponse | null> {
  try {
    const { data: seasonStats, error } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('back_number', playerNumber)
      .order('season', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    if (!seasonStats || seasonStats.length === 0) {
      return { seasonStats: [], careerStats: null };
    }

    // 통산 기록 계산
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

    return { seasonStats, careerStats };
  } catch (error) {
    console.error('Batter stats fetch error:', error);
    return null;
  }
}

// 투수 통계 fetching 함수
async function fetchPitcherStats(
  playerNumber: number,
): Promise<PitcherCareerResponse | null> {
  try {
    const { data: seasonStats, error } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('back_number', playerNumber)
      .order('season', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    if (!seasonStats || seasonStats.length === 0) {
      return { seasonStats: [], careerStats: null };
    }

    // 통산 기록 계산
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

    // 이닝 합산 (ex: "12.2" -> 12 + 2/3)
    function parseInning(inn: string) {
      if (!inn) return 0;
      const [whole, frac] = String(inn).split('.');
      return Number(whole) + (frac ? Number(frac) / 3 : 0);
    }
    const totalInnings = seasonStats.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );

    // ERA, WHIP, 승률, 피안타율, 탈삼진율 계산
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

    return { seasonStats, careerStats };
  } catch (error) {
    console.error('Pitcher stats fetch error:', error);
    return null;
  }
}

// 타자 통계 훅
export function useBatterStats(playerNumber: number) {
  return useQuery({
    queryKey: ['batter-stats', playerNumber],
    queryFn: () => fetchBatterStats(playerNumber),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// 투수 통계 훅
export function usePitcherStats(playerNumber: number) {
  return useQuery({
    queryKey: ['pitcher-stats', playerNumber],
    queryFn: () => fetchPitcherStats(playerNumber),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
