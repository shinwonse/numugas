import { supabase } from '@/lib/supabase';

export type TeamCareerStats = {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
};

export async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
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
