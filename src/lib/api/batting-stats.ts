import { supabase } from '@/lib/supabase';

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

export async function fetchBattingStats2025(): Promise<Stat[]> {
  try {
    // 직접 Supabase에서 데이터 가져오기
    const { data: seasonStats, error } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('season', '2025');

    if (error) {
      console.error('Failed to fetch batting stats from Supabase:', error);
      throw new Error('기록을 불러오지 못했습니다.');
    }

    if (!Array.isArray(seasonStats)) {
      console.error('Invalid season stats data structure');
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

    const teamMap = (p: any) => p.team || p.club || '';

    const stats = categories.map(({ category, sort, value, key }) => {
      // 1. value > 0 인 선수 TOP3
      const topPlayers = [...seasonStats]
        .filter((p) => value(p) > 0 && p.name)
        .sort(sort)
        .slice(0, 3);

      // 2. 부족하면 value==0 이고 이름순으로 채움 (중복X)
      if (topPlayers.length < 3) {
        const pickedNames = new Set(topPlayers.map((p) => p.name));
        const fillers = [...seasonStats]
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
        team: teamMap(p),
      }));
      return { category, players };
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch batting stats 2025:', error);

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
