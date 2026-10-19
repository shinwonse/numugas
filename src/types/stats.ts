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
  /** 승 / (승 + 패), 0~1 */
  win_rate: number;
}

/** 선수 기록을 합친 팀 통산 기록. 비율 기록은 표시용 문자열 */
export interface TeamCareerStats {
  hits: number;
  doubles: number;
  triples: number;
  homeruns: number;
  totalbases: number;
  rbi: number;
  runs: number;
  stolenbases: number;
  walks: number;
  /** 타율 / 출루율 / 장타율 / OPS (".287") */
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  strikeouts: number;
  /** "312.1" */
  innings: string;
  era: string;
  whip: string;
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
