import { supabase } from '@/lib/supabase';

export type TeamTotalStats = {
  win: number;
  lose: number;
  draw: number;
  total_games: number;
  win_rate: number; // %
};

export async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  try {
    const { data, error } = await supabase
      .from('team_records')
      .select('win, lose, draw');

    if (error) {
      console.error('Supabase error fetching team stats:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No team records data found, returning defaults');
      return {
        win: 0,
        lose: 0,
        draw: 0,
        total_games: 0,
        win_rate: 0,
      };
    }

    const total = data.reduce(
      (acc, cur) => {
        acc.win += cur.win || 0;
        acc.lose += cur.lose || 0;
        acc.draw += cur.draw || 0;
        return acc;
      },
      { win: 0, lose: 0, draw: 0 },
    );

    const total_games = total.win + total.lose + total.draw;
    const win_rate =
      total_games > 0
        ? Number(((total.win / total_games) * 100).toFixed(1))
        : 0;

    return {
      win: total.win,
      lose: total.lose,
      draw: total.draw,
      total_games,
      win_rate,
    };
  } catch (error) {
    console.error('Failed to fetch team total stats:', error);

    // Return fallback data
    return {
      win: 0,
      lose: 0,
      draw: 0,
      total_games: 0,
      win_rate: 0,
    };
  }
}
