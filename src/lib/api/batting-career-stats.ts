import { supabase } from '@/lib/supabase';
import { calculateRankingsWithTies } from '@/lib/utils';

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
    // 직접 Supabase에서 모든 시즌 데이터 가져오기
    const { data, error } = await supabase.from('batter_stats').select('*');

    if (error) {
      console.error(
        'Failed to fetch batting career stats from Supabase:',
        error,
      );
      throw new Error('통산 기록을 불러오지 못했습니다.');
    }

    // 선수별로 그룹화 및 통산 집계
    const playerMap: Record<string, any[]> = {};
    for (const row of data ?? []) {
      if (!playerMap[row.name]) playerMap[row.name] = [];
      playerMap[row.name].push(row);
    }

    // 통산 기록 계산
    const careerStats = Object.entries(playerMap).map(([name, records]) => {
      // 합산용 숫자 필드
      const sumFields = [
        'games',
        'plateappearances',
        'atbats',
        'runs',
        'hits',
        'singles',
        'doubles',
        'triples',
        'homeruns',
        'totalbases',
        'rbi',
        'stolenbases',
        'caughtstealing',
        'sacrificehits',
        'sacrificeflies',
        'walks',
        'intentionalwalks',
        'hitbypitch',
        'strikeouts',
        'doubleplays',
      ];
      const total: Record<string, number> = {};
      for (const field of sumFields) {
        total[field] = records.reduce(
          (acc, cur) => acc + Number(cur[field] ?? 0),
          0,
        );
      }
      // 타율, 출루율, 장타율 계산
      const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
      const onbase =
        total['atbats'] +
        total['walks'] +
        total['hitbypitch'] +
        total['sacrificeflies'];
      const onbasepercentage = onbase
        ? (total['hits'] + total['walks'] + total['hitbypitch']) / onbase
        : 0;
      const sluggingpercentage = total['atbats']
        ? total['totalbases'] / total['atbats']
        : 0;

      return {
        name,
        ...total,
        avg: avg.toFixed(3),
        onbasepercentage: onbasepercentage.toFixed(3),
        sluggingpercentage: sluggingpercentage.toFixed(3),
      };
    });

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
      // 1. value > 0 인 선수들을 정렬
      const topPlayers = [...careerStats]
        .filter((p) => value(p) > 0 && p.name)
        .sort(sort);

      // 2. 부족하면 value==0 이고 이름순으로 채움 (중복X)
      let allPlayers = [...topPlayers];
      if (topPlayers.length < 3) {
        const pickedNames = new Set(topPlayers.map((p) => p.name));
        const fillers = [...careerStats]
          .filter((p) => value(p) === 0 && p.name && !pickedNames.has(p.name))
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
          .slice(0, 3 - topPlayers.length);
        allPlayers.push(...fillers);
      }

      // 3. 공동 기록을 고려한 순위 계산
      const playersWithValue = allPlayers.map((p) => ({
        name: p.name,
        team: '', // 통산 기록에는 팀 정보가 없음
        value: value(p),
      }));

      const players = calculateRankingsWithTies(playersWithValue);
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
