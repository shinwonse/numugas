'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

/**
 * 시즌/리그 변경을 transition으로 처리한다.
 * - 선택값은 optimistic으로 즉시 바뀌고
 * - 서버 응답을 기다리는 동안 isPending으로 표 자리에 스켈레톤을 보여준다.
 */
export function useStatsNavigation(
  type: 'batter' | 'pitcher',
  season: string,
  league: string | undefined,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shownSeason, setShownSeason] = useOptimistic(season);
  const [shownLeague, setShownLeague] = useOptimistic(league ?? 'ALL');

  const changeSeason = (value: string) => {
    if (value === season) return;
    startTransition(() => {
      setShownSeason(value);
      setShownLeague('ALL');
      router.push(`/stats/${type}/${value}`);
    });
  };

  const changeLeague = (value: string) => {
    if (value === (league ?? 'ALL')) return;
    const base = `/stats/${type}/${season}`;
    startTransition(() => {
      setShownLeague(value);
      router.push(value === 'ALL' ? base : `${base}?league=${value}`);
    });
  };

  return { isPending, shownSeason, shownLeague, changeSeason, changeLeague };
}
