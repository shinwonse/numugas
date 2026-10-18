export interface StatsColumn {
  value: string;
  label: string;
}

export interface StatsTableConfig {
  columns: StatsColumn[];
  /** 처음 정렬 기준 (내림차순) */
  defaultSort: string;
  /** 굵게 강조하는 주요 지표 */
  highlight: string[];
  /** 셀 값 표시 형식 (기본: 그대로) */
  format?: (column: string, value: unknown) => string | number;
}

const BATTER: StatsTableConfig = {
  defaultSort: 'plateappearances',
  highlight: ['name', 'avg', 'homeruns', 'rbi'],
  columns: [
    { value: 'name', label: '선수명' },
    { value: 'games', label: '경기' },
    { value: 'avg', label: '타율' },
    { value: 'plateappearances', label: '타석' },
    { value: 'atbats', label: '타수' },
    { value: 'runs', label: '득점' },
    { value: 'hits', label: '안타' },
    { value: 'singles', label: '1루타' },
    { value: 'doubles', label: '2루타' },
    { value: 'triples', label: '3루타' },
    { value: 'homeruns', label: '홈런' },
    { value: 'totalbases', label: '루타' },
    { value: 'rbi', label: '타점' },
    { value: 'stolenbases', label: '도루' },
    { value: 'caughtstealing', label: '도루자' },
    { value: 'sacrificehits', label: '희생번트' },
    { value: 'sacrificeflies', label: '희생플라이' },
    { value: 'walks', label: '볼넷' },
    { value: 'intentionalwalks', label: '고의4구' },
    { value: 'hitbypitch', label: '사구' },
    { value: 'strikeouts', label: '삼진' },
    { value: 'doubleplays', label: '병살타' },
    { value: 'sluggingpercentage', label: '장타율' },
    { value: 'onbasepercentage', label: '출루율' },
  ],
};

const PITCHER: StatsTableConfig = {
  defaultSort: 'games',
  highlight: ['name', 'era', 'wins', 'strikeouts'],
  format: (column, value) =>
    column === 'winrate' && typeof value === 'number'
      ? value.toFixed(3)
      : (value as string | number),
  columns: [
    { value: 'name', label: '선수명' },
    { value: 'games', label: '경기' },
    { value: 'era', label: '평균자책' },
    { value: 'wins', label: '승' },
    { value: 'losses', label: '패' },
    { value: 'saves', label: '세이브' },
    { value: 'holds', label: '홀드' },
    { value: 'winrate', label: '승률' },
    { value: 'innings', label: '이닝' },
    { value: 'batters', label: '타자' },
    { value: 'atbats', label: '타수' },
    { value: 'hits', label: '피안타' },
    { value: 'homeruns', label: '피홈런' },
    { value: 'sacrificehits', label: '희생번트' },
    { value: 'sacrificeflies', label: '희생플라이' },
    { value: 'walks', label: '볼넷' },
    { value: 'intentionalwalks', label: '고의4구' },
    { value: 'hitbypitch', label: '사구' },
    { value: 'strikeouts', label: '삼진' },
    { value: 'wildpitches', label: '폭투' },
    { value: 'balks', label: '보크' },
    { value: 'runs', label: '실점' },
    { value: 'earnedruns', label: '자책' },
    { value: 'whip', label: 'WHIP' },
    { value: 'opponent_avg', label: '피안타율' },
    { value: 'strikeout_rate', label: '탈삼진%' },
  ],
};

export const STATS_TABLES = { batter: BATTER, pitcher: PITCHER } as const;
export type StatsType = keyof typeof STATS_TABLES;
