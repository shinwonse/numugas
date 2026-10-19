import { supabase } from '@/lib/supabase';
import type { TeamTotalStats } from '@/types/stats';

export async function fetchTeamTotalStats(): Promise<TeamTotalStats> {
  const { data, error } = await supabase
    .from('team_records')
    .select('win, lose, draw');

  if (error) {
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
  // 무승부는 승률 계산에서 뺀다 (팀 기록·상대 전적·투수 승률과 같은 기준)
  const decided = total.win + total.lose;
  const win_rate = decided > 0 ? total.win / decided : 0;

  return {
    win: total.win,
    lose: total.lose,
    draw: total.draw,
    total_games,
    win_rate,
  };
}

export interface TeamSeasonRecord {
  season: number;
  win: number;
  lose: number;
  draw: number;
}

/** 시즌별 팀 성적, 최근 시즌부터. 실패 시 throw. */
export async function fetchTeamSeasonRecords(): Promise<TeamSeasonRecord[]> {
  const { data, error } = await supabase
    .from('team_records')
    .select('season, win, lose, draw')
    .order('season', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((row) => ({
    season: Number(row.season),
    win: row.win || 0,
    lose: row.lose || 0,
    draw: row.draw || 0,
  }));
}
