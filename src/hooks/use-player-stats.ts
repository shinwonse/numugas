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

async function fetchBatterStats(
  playerNumber: number,
): Promise<BatterCareerResponse | null> {
  try {
    const res = await fetch(`/api/batter-career/${playerNumber}`);
    if (!res.ok) throw new Error('Failed to fetch batter stats');
    return res.json();
  } catch (error) {
    console.error('Batter stats fetch error:', error);
    return null;
  }
}

async function fetchPitcherStats(
  playerNumber: number,
): Promise<PitcherCareerResponse | null> {
  try {
    const res = await fetch(`/api/pitcher-career/${playerNumber}`);
    if (!res.ok) throw new Error('Failed to fetch pitcher stats');
    return res.json();
  } catch (error) {
    console.error('Pitcher stats fetch error:', error);
    return null;
  }
}

export function useBatterStats(playerNumber: number) {
  return useQuery({
    queryKey: ['batter-stats', playerNumber],
    queryFn: () => fetchBatterStats(playerNumber),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function usePitcherStats(playerNumber: number) {
  return useQuery({
    queryKey: ['pitcher-stats', playerNumber],
    queryFn: () => fetchPitcherStats(playerNumber),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
