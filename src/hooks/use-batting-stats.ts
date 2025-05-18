import { useEffect, useState } from 'react';

export interface BattingStatPlayer {
  rank: number;
  name: string;
  value: number;
  team: string;
}

export interface BattingStatCategory {
  category: string;
  players: BattingStatPlayer[];
}

export function useBattingStats2025() {
  const [battingStats, setBattingStats] = useState<BattingStatCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBattingStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/hitter-career/season?season=2025');
        if (!res.ok) throw new Error('기록을 불러오지 못했습니다.');
        const { seasonStats } = await res.json();
        if (!Array.isArray(seasonStats))
          throw new Error('기록 데이터가 올바르지 않습니다.');

        // TOP3 계산
        const categories = [
          {
            category: '타율',
            key: 'avg',
            sort: (a: any, b: any) => Number(b.avg) - Number(a.avg),
            value: (p: any) => Number(p.avg),
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
            sort: (a: any, b: any) =>
              Number(b.stolenbases) - Number(a.stolenbases),
            value: (p: any) => Number(p.stolenbases),
          },
        ];

        const teamMap = (p: any) => p.team || p.club || '';

        const stats = categories.map(({ category, sort, value, key }) => {
          const top3 = [...seasonStats]
            .filter((p) => value(p) > 0 && p.name)
            .sort(sort)
            .slice(0, 3)
            .map((p, i) => ({
              rank: i + 1,
              name: p.name,
              value: value(p),
              team: teamMap(p),
            }));
          return { category, players: top3 };
        });
        setBattingStats(stats);
      } catch (e: any) {
        setError(e.message || '기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchBattingStats();
  }, []);

  return { battingStats, loading, error };
}
