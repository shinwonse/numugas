export interface HistoryEvent {
  year: number;
  events: {
    month?: number;
    title: string;
    description?: string;
  }[];
}

export const TEAM_HISTORY: HistoryEvent[] = [
  {
    year: 2026,
    events: [
      {
        month: 3,
        title: '리그 이동',
        description: '2026 시즌 에코리그 및 중랑리그 참가',
      },
    ],
  },
  {
    year: 2025,
    events: [
      {
        month: 3,
        title: '2개 리그 운영',
        description: '2025 시즌 노원리그 및 중랑리그 참가',
      },
      {
        month: 10,
        title: '중랑리그 준우승',
        description: '2025 시즌 중랑리그 준우승',
      },
    ],
  },
  {
    year: 2024,
    events: [
      {
        month: 10,
        title: '노원리그 준우승',
        description: '2024 시즌 노원리그 준우승',
      },
    ],
  },
  {
    year: 2023,
    events: [
      {
        month: 3,
        title: '리그 이동',
        description: '2023 시즌 노원리그 참가',
      },
      {
        month: 11,
        title: '후반기 준우승',
        description: '2023 시즌 노원리그 후반기 준우승',
      },
    ],
  },
  {
    year: 2022,
    events: [
      {
        month: 10,
        title: '두번째 우승',
        description: '2022 시즌 챔프베이스볼 토요리그 전승 우승',
      },
      {
        month: 11,
        title: '노원구청장기 참가',
        description: '2022 시즌 노원구청장기 3위',
      },
      {
        month: 11,
        title: '서울특별시장기 참가',
      },
    ],
  },
  {
    year: 2021,
    events: [
      {
        month: 10,
        title: '창단 첫 우승',
        description: '2021 시즌 챔프베이스볼 토요리그 우승',
      },
    ],
  },
  {
    year: 2020,
    events: [
      {
        month: 3,
        title: '창단 첫 시즌',
        description: '2020 시즌 챔프베이스볼 리그 참가',
      },
    ],
  },
  {
    year: 2019,
    events: [
      {
        month: 10,
        title: '팀 창단',
        description: '담장NUMUGAS 창단',
      },
    ],
  },
];
