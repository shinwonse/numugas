import { useQuery } from '@tanstack/react-query';

const fetchBattingStatsBySeason = async (season?: string) => {
  if (!season) throw new Error('시즌 정보가 필요합니다.');
  const res = await fetch(`/api/batter-career/season?season=${season}`);
  if (!res.ok) throw new Error('기록을 불러오지 못했습니다.');
  const { seasonStats } = await res.json();
  return seasonStats;
};

export function useBattingStatsBySeason(season?: string) {
  return useQuery<any[], Error>({
    queryKey: ['battingStatsBySeason', season],
    queryFn: async () => fetchBattingStatsBySeason(season),
    select: (stats) => stats,
  });
}
