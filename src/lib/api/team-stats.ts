import { createClient } from '@supabase/supabase-js';

export interface TeamTotalStats {
  win_rate: string;
  win: number;
  lose: number;
  draw: number;
}

export async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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
    total_games > 0 ? ((total.win / total_games) * 100).toFixed(1) : '0.0';

  return {
    win_rate,
    win: total.win,
    lose: total.lose,
    draw: total.draw,
  };
}
