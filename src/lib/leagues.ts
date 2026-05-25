export const LEAGUES = [
  'ECOKING',
  'JUNGNANG',
  'NOWON',
  'MYUNGPUM',
  'CHAMP',
  'BAEKHO',
] as const;
export type League = (typeof LEAGUES)[number];

export const LEGACY_LEAGUE = 'LEGACY';

export const LEAGUE_LABELS: Record<League | typeof LEGACY_LEAGUE, string> = {
  ECOKING: '에코킹리그',
  JUNGNANG: '중랑리그',
  NOWON: '노원리그',
  MYUNGPUM: '명품리그',
  CHAMP: '챔프베이스볼리그',
  BAEKHO: '백호리그',
  LEGACY: '리그 통합',
};

export type LeagueParams = {
  lig_idx: number;
  group: number;
  part: number;
};

// 같은 시즌·같은 리그에 여러 group이 있는 경우 (전·후반기 등) 배열로 통합
export const LEAGUE_PARAMS: Record<
  string,
  Partial<Record<League, LeagueParams[]>>
> = {
  '2026': {
    ECOKING: [{ lig_idx: 733, group: 172, part: 2 }],
    JUNGNANG: [{ lig_idx: 10345, group: 19, part: 1 }],
  },
  '2025': {
    NOWON: [{ lig_idx: 237, group: 52, part: 0 }],
    JUNGNANG: [{ lig_idx: 10345, group: 17, part: 1 }],
  },
  '2024': {
    NOWON: [{ lig_idx: 237, group: 45, part: 0 }],
    MYUNGPUM: [{ lig_idx: 10750, group: 26, part: 0 }],
  },
  '2023': {
    NOWON: [
      { lig_idx: 237, group: 36, part: 0 },
      { lig_idx: 237, group: 40, part: 0 },
    ],
  },
  '2022': {
    CHAMP: [{ lig_idx: 931, group: 61, part: 0 }],
  },
  '2021': {
    CHAMP: [{ lig_idx: 931, group: 55, part: 0 }],
    BAEKHO: [{ lig_idx: 302, group: 26, part: 0 }],
  },
  '2020': {
    CHAMP: [{ lig_idx: 931, group: 48, part: 0 }],
  },
};

export function getLeaguesForSeason(season: string): League[] {
  const map = LEAGUE_PARAMS[season];
  if (!map) return [];
  return (Object.keys(map) as League[]).filter(
    (l) => (map[l]?.length ?? 0) > 0,
  );
}

export function getLeagueParams(
  season: string,
  league: League,
): LeagueParams[] {
  return LEAGUE_PARAMS[season]?.[league] ?? [];
}
