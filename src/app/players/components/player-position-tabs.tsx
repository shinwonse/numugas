'use client';

import StatsTabs from '@/components/stats-tabs';

interface PlayerPositionTabsProps {
  positions: string[];
  selectedPosition: string;
  onSelect: (position: string) => void;
  className?: string;
}

export default function PlayerPositionTabs({
  positions,
  selectedPosition,
  onSelect,
  className,
}: PlayerPositionTabsProps) {
  const tabList = positions.map((pos) => ({
    key: pos,
    label: pos,
  }));

  return (
    <StatsTabs
      tabs={tabList}
      current={selectedPosition}
      className={className}
      onTabClick={onSelect}
    />
  );
}
