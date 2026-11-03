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

interface TotalStatsSectionProps {
  battingStats: Stat[];
  pitchingStats: Stat[];
}

export function TotalStatsSection({
  battingStats,
  pitchingStats,
}: TotalStatsSectionProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1 });

  const [currentTab, setCurrentTab] = useState<StatsTabKey>('batting');
  const handleTabClick = useCallback((key: string) => {
    setCurrentTab(key as StatsTabKey);
  }, []);

  return (
    <section
      id="통산기록"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 md:py-28"
    >
      <div className="page-container relative z-10">
        <SectionTitle
          title="통산 선수 순위"
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
        <LeaderBoard
          key={currentTab}
          stats={currentTab === 'batting' ? battingStats : pitchingStats}
        />
      </div>
    </section>
  );
}
