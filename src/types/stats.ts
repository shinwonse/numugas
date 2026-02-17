export interface Player {
  rank: number;
  name: string;
  team: string;
  value: number;
}

export interface Stat {
  category: string;
  players: Player[];
}

export interface TeamTotalStats {
  win: number;
  lose: number;
  draw: number;
  total_games: number;
  win_rate: number;
}

export interface TeamCareerStats {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
}
