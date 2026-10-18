'use client';

import { PageHeader } from '@/components/page-header';
import StatsTabs from '@/components/stats-tabs';

interface StatsPageHeaderProps {
  tabList: Array<{ key: string; label: string; href: string; prefetch?: boolean }>;
  currentType: string;
}

export function StatsPageHeader({ tabList, currentType }: StatsPageHeaderProps) {
  return (
    <div className="mb-8">
      <PageHeader eyebrow="Player Statistics" title="선수 기록" />
      <div className="flex justify-center">
        <StatsTabs tabs={tabList} current={currentType} />
      </div>
    </div>
  );
}
