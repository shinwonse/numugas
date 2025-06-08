export interface TeamCareerStats {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
}

export async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch hitter stats
  const hitterRes = await fetch(`${baseUrl}/api/batter-career`);
  if (!hitterRes.ok) throw new Error('Failed to fetch hitter career stats');
  const { careerStats: hitterStats } = await hitterRes.json();

  // Fetch pitcher stats
  const pitcherRes = await fetch(`${baseUrl}/api/pitcher-career`);
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
