import { useQuery } from '@tanstack/react-query';

export type TeamTotalStats = {
  win: number;
  lose: number;
  draw: number;
  total_games: number;
  win_rate: number; // %
};

async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const res = await fetch('/api/crawl-team/total');
  if (!res.ok) throw new Error('Failed to fetch team stats');
  return res.json();
}

export function useTeamTotalStats() {
  return useQuery<TeamTotalStats, Error>({
    queryKey: ['teamTotalStats'],
    queryFn: fetchTeamTotalStats,
  });
}
