'use client';

import { PageHeader } from '@/components/page-header';
import StatsTabs from '@/components/stats-tabs';

interface StatsPageHeaderProps {
  eyebrow: string;
  title: string;
  tabList: Array<{ key: string; label: string; href: string; prefetch?: boolean }>;
  currentType: string;
}

export function StatsPageHeader({
  eyebrow,
  title,
  tabList,
  currentType,
}: StatsPageHeaderProps) {
  return (
    <div className="mb-8">
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="flex justify-center">
        <StatsTabs tabs={tabList} current={currentType} />
      </div>
    </div>
  );
}
