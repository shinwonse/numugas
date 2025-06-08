import { createClient } from '@supabase/supabase-js';

export interface TeamCareerStats {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
}

export async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Fetch hitter stats
  const { data: hitterStats, error: hitterError } = await supabase
    .from('batter_stats')
    .select('homeruns, totalbases, hits');
  if (hitterError) throw hitterError;

  // Fetch pitcher stats
  const { data: pitcherStats, error: pitcherError } = await supabase
    .from('pitcher_stats')
    .select('strikeouts');
  if (pitcherError) throw pitcherError;

  // Aggregate hitter stats
  const homeruns = hitterStats.reduce(
    (acc, cur) => acc + Number(cur.homeruns ?? 0),
    0,
  );
  const totalbases = hitterStats.reduce(
    (acc, cur) => acc + Number(cur.totalbases ?? 0),
    0,
  );
  const hits = hitterStats.reduce((acc, cur) => acc + Number(cur.hits ?? 0), 0);

  // Aggregate pitcher strikeouts
  const strikeouts = pitcherStats.reduce(
    (acc, cur) => acc + Number(cur.strikeouts ?? 0),
    0,
  );

  return { homeruns, totalbases, hits, strikeouts };
}
