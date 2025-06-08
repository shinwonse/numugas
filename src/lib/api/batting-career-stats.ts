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

export async function fetchBattingCareerStats(): Promise<Stat[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/batter-career`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch batting career stats: ${res.status} ${res.statusText}`,
      );
      throw new Error('통산 기록을 불러오지 못했습니다.');
    }

    const { careerStats } = await res.json();

    if (!Array.isArray(careerStats)) {
      console.error('Invalid career stats data structure');
      throw new Error('기록 데이터가 올바르지 않습니다.');
    }

    // TOP3 계산
    const categories = [
      {
        category: '안타',
        key: 'hits',
        sort: (a: any, b: any) => Number(b.hits) - Number(a.hits),
        value: (p: any) => Number(p.hits),
      },
      {
        category: '홈런',
        key: 'homeruns',
        sort: (a: any, b: any) => Number(b.homeruns) - Number(a.homeruns),
        value: (p: any) => Number(p.homeruns),
      },
      {
        category: '타점',
        key: 'rbi',
        sort: (a: any, b: any) => Number(b.rbi) - Number(a.rbi),
        value: (p: any) => Number(p.rbi),
      },
      {
        category: '도루',
        key: 'stolenbases',
        sort: (a: any, b: any) => Number(b.stolenbases) - Number(a.stolenbases),
        value: (p: any) => Number(p.stolenbases),
      },
    ];

    const stats = categories.map(({ category, sort, value, key }) => {
      // 1. value > 0 인 선수 TOP3
      const topPlayers = [...careerStats]
        .filter((p) => value(p) > 0 && p.name)
        .sort(sort)
        .slice(0, 3);

      // 2. 부족하면 value==0 이고 이름순으로 채움 (중복X)
      if (topPlayers.length < 3) {
        const pickedNames = new Set(topPlayers.map((p) => p.name));
        const fillers = [...careerStats]
          .filter((p) => value(p) === 0 && p.name && !pickedNames.has(p.name))
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
          .slice(0, 3 - topPlayers.length);
        topPlayers.push(...fillers);
      }

      // 3. 최종 3명만, 이름순 정렬은 하지 않고 랭크만 부여
      const players = topPlayers.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        name: p.name,
        value: value(p),
        team: '', // 통산 기록에는 팀 정보가 없음
      }));
      return { category, players };
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch batting career stats:', error);

    // Return fallback empty stats
    return [
      {
        category: '안타',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '홈런',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '타점',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '도루',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
    ];
  }
}
