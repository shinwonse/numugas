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

export async function fetchPitchingCareerStats(): Promise<Stat[]> {
  try {
    // 직접 Supabase에서 모든 시즌 데이터 가져오기
    const { data, error } = await supabase.from('pitcher_stats').select('*');

    if (error) {
      console.error(
        'Failed to fetch pitching career stats from Supabase:',
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
        'wins',
        'losses',
        'saves',
        'holds',
        'batters',
        'atbats',
        'pitches',
        'hits',
        'homeruns',
        'sacrificehits',
        'sacrificeflies',
        'walks',
        'intentionalwalks',
        'hitbypitch',
        'strikeouts',
        'wildpitches',
        'balks',
        'runs',
        'earnedruns',
      ];
      const total: Record<string, number> = {};
      for (const field of sumFields) {
        total[field] = records.reduce(
          (acc, cur) => acc + Number(cur[field] ?? 0),
          0,
        );
      }

      // 이닝 합산 (ex: "12.2" -> 12 + 2/3)
      function parseInning(inn: string) {
        if (!inn) return 0;
        const [whole, frac] = String(inn).split('.');
        return Number(whole) + (frac ? Number(frac) / 3 : 0);
      }
      const totalInnings = records.reduce(
        (acc, cur) => acc + parseInning(cur.innings),
        0,
      );

      // ERA, WHIP, 승률, 피안타율, 탈삼진율 계산
      const era = totalInnings ? (total['earnedruns'] * 9) / totalInnings : 0;
      const whip = totalInnings
        ? (total['hits'] + total['walks']) / totalInnings
        : 0;
      const winRate =
        total['wins'] + total['losses']
          ? total['wins'] / (total['wins'] + total['losses'])
          : 0;
      const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
      const strikeoutRate = totalInnings
        ? (total['strikeouts'] * 9) / totalInnings
        : 0;

      return {
        name,
        ...total,
        innings: totalInnings.toFixed(1),
        era: era.toFixed(2),
        whip: whip.toFixed(2),
        winrate: winRate.toFixed(3),
        avg: avg.toFixed(3),
        strikeoutrate: strikeoutRate.toFixed(1),
      };
    });

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

    const stats = categories.map(({ category, sort, value, key }) => {
      // 평균자책점은 0보다 큰 값만, 나머지는 0 초과
      const filterFn =
        key === 'era'
          ? (p: any) => value(p) > 0 && p.name
          : (p: any) => value(p) > 0 && p.name;
      const topPlayers = [...careerStats].filter(filterFn).sort(sort);

      let allPlayers = [...topPlayers];
      if (topPlayers.length < 3) {
        const pickedNames = new Set(topPlayers.map((p) => p.name));
        const fillers = [...careerStats]
          .filter((p) => value(p) === 0 && p.name && !pickedNames.has(p.name))
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
          .slice(0, 3 - topPlayers.length);
        allPlayers.push(...fillers);
      }

      // 공동 기록을 고려한 순위 계산
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
    console.error('Failed to fetch pitching career stats:', error);

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
