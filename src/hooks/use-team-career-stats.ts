import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

export type TeamCareerStats = {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
};

async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: hitterData, error: hitterError } = await supabase
    .from('batter_stats')
    .select('homeruns, totalbases, hits');
  if (hitterError) throw hitterError;

  const { data: pitcherData, error: pitcherError } = await supabase
    .from('pitcher_stats')
    .select('strikeouts');
  if (pitcherError) throw pitcherError;

  const hitterStats = hitterData.reduce(
    (acc, cur) => {
      acc.homeruns += cur.homeruns;
      acc.totalbases += cur.totalbases;
      acc.hits += cur.hits;
      return acc;
    },
    { homeruns: 0, totalbases: 0, hits: 0 },
  );

  const strikeouts = pitcherData.reduce((acc, cur) => acc + cur.strikeouts, 0);

  return {
    ...hitterStats,
    strikeouts,
  };
}

export function useTeamCareerStats() {
  return useQuery<TeamCareerStats, Error>({
    queryKey: ['teamCareerStats'],
    queryFn: fetchTeamCareerStats,
  });
}
