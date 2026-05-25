import type { BatterStat } from '@/types/stats';
import { useQuery } from '@tanstack/react-query';

const fetchBattingStatsBySeason = async (
  season?: string,
  league?: string,
): Promise<BatterStat[]> => {
  const params = new URLSearchParams();
  if (season) params.set('season', season);
  if (league) params.set('league', league);
  const qs = params.toString();
  const endpoint = season
    ? '/api/batter-career/season'
    : '/api/batter-career';
  const res = await fetch(`${endpoint}${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('기록을 불러오지 못했습니다.');
  const json = await res.json();
  return season ? json.seasonStats : json.careerStats;
};

export function useBattingStatsBySeason(season?: string, league?: string) {
  return useQuery<BatterStat[], Error>({
    queryKey: ['battingStatsBySeason', season, league],
    queryFn: async () => fetchBattingStatsBySeason(season, league),
  });
}
