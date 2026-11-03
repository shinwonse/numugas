'use client';

import { PageHeader } from '@/components/page-header';
import StatsTabs from '@/components/stats-tabs';

interface StatsPageHeaderProps {
  title: string;
  tabList: Array<{ key: string; label: string; href: string; prefetch?: boolean }>;
  currentType: string;
}

export function StatsPageHeader({
  title,
  tabList,
  currentType,
}: StatsPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <PageHeader title={title} className="mb-0" />
      <StatsTabs tabs={tabList} current={currentType} className="md:mx-0" />
    </div>
  );
}
