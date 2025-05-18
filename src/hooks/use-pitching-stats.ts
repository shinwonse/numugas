import { useEffect, useState } from 'react';

export interface PitchingStatPlayer {
  rank: number;
  name: string;
  value: number;
  team: string;
}

export interface PitchingStatCategory {
  category: string;
  players: PitchingStatPlayer[];
}

export function usePitchingStats2025() {
  const [pitchingStats, setPitchingStats] = useState<PitchingStatCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPitchingStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/pitcher-career/season?season=2025');
        if (!res.ok) throw new Error('기록을 불러오지 못했습니다.');
        const { seasonStats } = await res.json();
        if (!Array.isArray(seasonStats))
          throw new Error('기록 데이터가 올바르지 않습니다.');

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
            sort: (a: any, b: any) =>
              Number(b.strikeouts) - Number(a.strikeouts),
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
          // 1. value > 0 인 선수 TOP3 (평균자책점은 0보다 큰 값만, 나머지는 0 초과)
          const topPlayers = [...seasonStats]
            .filter((p) => value(p) > 0 && p.name)
            .sort(sort)
            .slice(0, 3);

          // 2. 부족하면 value==0 이고 이름순으로 채움 (중복X)
          if (topPlayers.length < 3) {
            const pickedNames = new Set(topPlayers.map((p) => p.name));
            const fillers = [...seasonStats]
              .filter(
                (p) => value(p) === 0 && p.name && !pickedNames.has(p.name),
              )
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
        setPitchingStats(stats);
      } catch (e: any) {
        setError(e.message || '기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchPitchingStats();
  }, []);

  return { pitchingStats, loading, error };
}

export function usePitchingCareerStats() {
  const [pitchingStats, setPitchingStats] = useState<PitchingStatCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPitchingCareerStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/pitcher-career');
        if (!res.ok) throw new Error('통산 기록을 불러오지 못했습니다.');
        const { careerStats } = await res.json();
        if (!Array.isArray(careerStats))
          throw new Error('기록 데이터가 올바르지 않습니다.');

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
            sort: (a: any, b: any) =>
              Number(b.strikeouts) - Number(a.strikeouts),
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
          const topPlayers = [...careerStats]
            .filter(filterFn)
            .sort(sort)
            .slice(0, 3);

          if (topPlayers.length < 3) {
            const pickedNames = new Set(topPlayers.map((p) => p.name));
            const fillers = [...careerStats]
              .filter(
                (p) => value(p) === 0 && p.name && !pickedNames.has(p.name),
              )
              .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
              .slice(0, 3 - topPlayers.length);
            topPlayers.push(...fillers);
          }

          const players = topPlayers.slice(0, 3).map((p, i) => ({
            rank: i + 1,
            name: p.name,
            value: value(p),
            team: '', // 통산 기록에는 팀 정보가 없음
          }));
          return { category, players };
        });
        setPitchingStats(stats);
      } catch (e: any) {
        setError(e.message || '통산 기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchPitchingCareerStats();
  }, []);

  return { pitchingStats, loading, error };
}
