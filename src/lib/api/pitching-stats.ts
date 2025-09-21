import { calculateRankingsWithTies } from '@/lib/calculate-rankings-with-ties';
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

export async function fetchPitchingStats2025(): Promise<Stat[]> {
  try {
    // 직접 Supabase에서 데이터 가져오기
    const { data: seasonStats, error } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('season', '2025');

    if (error) {
      console.error('Failed to fetch pitching stats from Supabase:', error);
      throw new Error('기록을 불러오지 못했습니다.');
    }

    if (!Array.isArray(seasonStats)) {
      console.error('Invalid season stats data structure');
      throw new Error('기록 데이터가 올바르지 않습니다.');
    }

    // TOP3 계산
    const categories = [
      {
        category: '이닝',
        key: 'innings',
        sort: (a: any, b: any) => Number(b.innings) - Number(a.innings),
        value: (p: any) => Number(p.innings),
      },
      {
        category: '승리',
        key: 'wins',
        sort: (a: any, b: any) => Number(b.wins) - Number(a.wins),
        value: (p: any) => Number(p.wins),
      },
      {
        category: '탈삼진',
        key: 'strikeouts',
        sort: (a: any, b: any) => Number(b.strikeouts) - Number(a.strikeouts),
        value: (p: any) => Number(p.strikeouts),
      },
      {
        category: '세이브',
        key: 'saves',
        sort: (a: any, b: any) => Number(b.saves) - Number(a.saves),
        value: (p: any) => Number(p.saves),
      },
    ];

    const teamMap = (p: any) => p.team || p.club || '';

    const stats = categories.map(({ category, sort, value, key }) => {
      // 1. value > 0 인 선수들을 정렬
      const topPlayers = [...seasonStats]
        .filter((p) => value(p) > 0 && p.name)
        .sort(sort);

      // 2. 부족하면 value==0 이고 이름순으로 채움 (중복X)
      let allPlayers = [...topPlayers];
      if (topPlayers.length < 3) {
        const pickedNames = new Set(topPlayers.map((p) => p.name));
        const fillers = [...seasonStats]
          .filter((p) => value(p) === 0 && p.name && !pickedNames.has(p.name))
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
          .slice(0, 3 - topPlayers.length);
        allPlayers.push(...fillers);
      }

      // 3. 공동 기록을 고려한 순위 계산
      const playersWithValue = allPlayers.map((p) => ({
        name: p.name,
        team: teamMap(p),
        value: value(p),
      }));

      const players = calculateRankingsWithTies(playersWithValue);
      return { category, players };
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch pitching stats 2025:', error);

    // Return fallback empty stats
    return [
      {
        category: '이닝',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '승리',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '탈삼진',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
      {
        category: '세이브',
        players: [
          { rank: 1, name: '-', team: '', value: 0 },
          { rank: 2, name: '-', team: '', value: 0 },
          { rank: 3, name: '-', team: '', value: 0 },
        ],
      },
    ];
  }
}
