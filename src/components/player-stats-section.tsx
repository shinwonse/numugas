'use client';

import { SectionTitle } from '@/components/animated/section-title';
import { LeaderBoard } from '@/components/leader-board';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import type { Stat } from '@/types/stats';
import { useCallback, useState } from 'react';
import StatsTabs from './stats-tabs';

type StatsTabKey = 'batting' | 'pitching';

const TABS = [
  { key: 'batting', label: '타자' },
  { key: 'pitching', label: '투수' },
];

interface PlayerStatsSectionProps {
  /** 표시할 시즌 ("2026") */
  season: string;
  battingStats: Stat[];
  pitchingStats: Stat[];
}

function isStatsEmpty(stats: Stat[]): boolean {
  if (!stats || stats.length === 0) return true;
  return stats.every((stat) =>
    stat.players.every((player) => player.name === '-' || player.value === 0),
  );
}

function SeasonComingSoon({ season }: { season: string }) {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-white/60">
      {season} 시즌 기록이 아직 없습니다.
    </p>
  );
}

export function PlayerStatsSection({
  season,
  battingStats,
  pitchingStats,
}: PlayerStatsSectionProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1 });

  const [currentTab, setCurrentTab] = useState<StatsTabKey>('batting');
  const handleTabClick = useCallback((key: string) => {
    setCurrentTab(key as StatsTabKey);
  }, []);

  const stats = currentTab === 'batting' ? battingStats : pitchingStats;

  return (
    <section
      id="선수기록"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 md:py-28"
    >
      <div className="page-container relative z-10">
        <SectionTitle
          title={`${season} 시즌 선수 순위`}
          isInView={isInView}
          action={
            <StatsTabs
              tabs={TABS}
              current={currentTab}
              onTabClick={handleTabClick}
              className="md:mx-0 md:w-56"
            />
          }
        />
        {isStatsEmpty(stats) ? (
          <SeasonComingSoon season={season} />
        ) : (
          <LeaderBoard key={currentTab} stats={stats} />
        )}
      </div>
    </section>
  );
}
