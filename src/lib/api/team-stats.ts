export interface TeamTotalStats {
  win_rate: string;
  win: number;
  lose: number;
  draw: number;
}

export async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/crawl-team/total`);
  if (!res.ok) throw new Error('Failed to fetch team stats');
  return res.json();
}
