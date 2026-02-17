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

export interface PitcherStat {
  name: string;
  team?: string;
  club?: string;
  season?: string;
  games: number;
  era: string;
  wins: number;
  losses: number;
  saves: number;
  holds: number;
  winrate: string;
  innings: string;
  batters: number;
  atbats: number;
  pitches: number;
  hits: number;
  homeruns: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  wildpitches: number;
  balks: number;
  runs: number;
  earnedruns: number;
  whip: string;
  avg: string;
  strikeoutrate: string;
}

export interface BatterStat {
  name: string;
  team?: string;
  club?: string;
  season?: string;
  games: number;
  avg: string;
  plateappearances: number;
  atbats: number;
  runs: number;
  hits: number;
  singles: number;
  doubles: number;
  triples: number;
  homeruns: number;
  totalbases: number;
  rbi: number;
  stolenbases: number;
  caughtstealing: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  doubleplays: number;
  sluggingpercentage: string;
  onbasepercentage: string;
}
