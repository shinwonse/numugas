import { useQuery } from '@tanstack/react-query';

export type TeamCareerStats = {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
};

async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  // Fetch hitter stats
  const hitterRes = await fetch('/api/hitter-career');
  if (!hitterRes.ok) throw new Error('Failed to fetch hitter career stats');
  const { careerStats: hitterStats } = await hitterRes.json();

  // Fetch pitcher stats
  const pitcherRes = await fetch('/api/pitcher-career');
  if (!pitcherRes.ok) throw new Error('Failed to fetch pitcher career stats');
  const { careerStats: pitcherStats } = await pitcherRes.json();

  // Aggregate hitter stats
  const homeruns = hitterStats.reduce(
    (acc: number, cur: any) => acc + Number(cur.homeruns ?? 0),
    0,
  );
  const totalbases = hitterStats.reduce(
    (acc: number, cur: any) => acc + Number(cur.totalbases ?? 0),
    0,
  );
  const hits = hitterStats.reduce(
    (acc: number, cur: any) => acc + Number(cur.hits ?? 0),
    0,
  );

  // Aggregate pitcher strikeouts
  const strikeouts = pitcherStats.reduce(
    (acc: number, cur: any) => acc + Number(cur.strikeouts ?? 0),
    0,
  );

  return { homeruns, totalbases, hits, strikeouts };
}

export function useTeamCareerStats() {
  return useQuery<TeamCareerStats, Error>({
    queryKey: ['teamCareerStats'],
    queryFn: fetchTeamCareerStats,
  });
}
