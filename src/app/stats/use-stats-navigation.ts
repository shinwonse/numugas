'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useOptimistic, useState, useTransition } from 'react';

/** 이보다 빨리 끝나는 전환은 스켈레톤 없이 기존 표를 잠깐 흐리게만 한다 */
const SKELETON_DELAY_MS = 300;

/**
 * 시즌/리그 변경을 transition으로 처리한다.
 * - 선택값은 optimistic으로 즉시 바뀌고
 * - 응답이 SKELETON_DELAY_MS 안에 오면 기존 표를 흐리게만(isPending),
 *   더 걸리면 표 자리에 스켈레톤(showSkeleton)을 보여준다.
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
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setShowSkeleton(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, SKELETON_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [isPending]);

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

  return {
    isPending,
    showSkeleton,
    shownSeason,
    shownLeague,
    changeSeason,
    changeLeague,
  };
}
