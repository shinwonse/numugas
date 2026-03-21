import type { TeamCareerStats } from '@/types/stats';
import { useQuery } from '@tanstack/react-query';

async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  const res = await fetch('/api/team/career-stats');
  if (!res.ok) throw new Error('Failed to fetch team career stats');
  return res.json();
}

export function useTeamCareerStats() {
  return useQuery<TeamCareerStats, Error>({
    queryKey: ['teamCareerStats'],
    queryFn: fetchTeamCareerStats,
  });
}
