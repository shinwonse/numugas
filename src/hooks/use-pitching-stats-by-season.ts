import type { PitcherStat } from '@/types/stats';
import { useQuery } from '@tanstack/react-query';

const fetchPitchingStatsBySeason = async (
  season?: string,
  league?: string,
): Promise<PitcherStat[]> => {
  const params = new URLSearchParams();
  if (season) params.set('season', season);
  if (league) params.set('league', league);
  const qs = params.toString();
  const endpoint = season
    ? '/api/pitcher-career/season'
    : '/api/pitcher-career';
  const res = await fetch(`${endpoint}${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('기록을 불러오지 못했습니다.');
  const json = await res.json();
  return season ? json.seasonStats : json.careerStats;
};

export function usePitchingStatsBySeason(season?: string, league?: string) {
  return useQuery<PitcherStat[], Error>({
    queryKey: ['pitchingStatsBySeason', season, league],
    queryFn: async () => fetchPitchingStatsBySeason(season, league),
  });
}
