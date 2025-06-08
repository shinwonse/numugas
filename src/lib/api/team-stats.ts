import { supabase } from '@/lib/supabase';

export type TeamTotalStats = {
  win: number;
  lose: number;
  draw: number;
  total_games: number;
  win_rate: number; // %
};

export async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const { data, error } = await supabase
    .from('team_records')
    .select('win, lose, draw');
  if (error) throw error;

  const total = data.reduce(
    (acc, cur) => {
      acc.win += cur.win;
      acc.lose += cur.lose;
      acc.draw += cur.draw;
      return acc;
    },
    { win: 0, lose: 0, draw: 0 },
  );
  const total_games = total.win + total.lose + total.draw;
  const win_rate =
    total_games > 0 ? Number(((total.win / total_games) * 100).toFixed(1)) : 0;

  return {
    win: total.win,
    lose: total.lose,
    draw: total.draw,
    total_games,
    win_rate,
  };
}
