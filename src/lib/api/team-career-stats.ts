import { supabase } from '@/lib/supabase';

export type TeamCareerStats = {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
};

export async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  try {
    const { data: hitterData, error: hitterError } = await supabase
      .from('batter_stats')
      .select('homeruns, totalbases, hits');

    if (hitterError) {
      console.error('Supabase error fetching hitter stats:', hitterError);
      throw hitterError;
    }

    const { data: pitcherData, error: pitcherError } = await supabase
      .from('pitcher_stats')
      .select('strikeouts');

    if (pitcherError) {
      console.error('Supabase error fetching pitcher stats:', pitcherError);
      throw pitcherError;
    }

    const hitterStats = (hitterData || []).reduce(
      (acc, cur) => {
        acc.homeruns += cur.homeruns || 0;
        acc.totalbases += cur.totalbases || 0;
        acc.hits += cur.hits || 0;
        return acc;
      },
      { homeruns: 0, totalbases: 0, hits: 0 },
    );

    const strikeouts = (pitcherData || []).reduce(
      (acc, cur) => acc + (cur.strikeouts || 0),
      0,
    );

    return {
      ...hitterStats,
      strikeouts,
    };
  } catch (error) {
    console.error('Failed to fetch team career stats:', error);

    // Return fallback data
    return {
      homeruns: 0,
      totalbases: 0,
      hits: 0,
      strikeouts: 0,
    };
  }
}
