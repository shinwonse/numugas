import type { TeamTotalStats } from '@/types/stats';
import { useQuery } from '@tanstack/react-query';

async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const res = await fetch('/api/team/total-stats');
  if (!res.ok) throw new Error('Failed to fetch team total stats');
  return res.json();
}

export function useTeamTotalStats() {
  return useQuery<TeamTotalStats, Error>({
    queryKey: ['teamTotalStats'],
    queryFn: fetchTeamTotalStats,
  });
}
