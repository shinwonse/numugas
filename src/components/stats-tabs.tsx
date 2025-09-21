'use client';

import { cn } from '@/lib/cn';

interface StatsTab {
  key: string;
  label: string;
  href?: string;
}

interface StatsTabsProps {
  tabs: StatsTab[];
  current: string;
  className?: string;
  onTabClick?: (key: string) => void;
}

function getColClass(tabCount: number) {
  switch (tabCount) {
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-3';
    case 4:
      return 'grid-cols-4';
    case 5:
      return 'grid-cols-5';
    case 6:
      return 'grid-cols-6';
    case 7:
      return 'grid-cols-7';
    default:
      return '';
  }
}

function StatsTabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: StatsTab;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      key={tab.key}
      href={tab.href ?? '#'}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center h-10 sm:h-full w-full text-center font-bold text-base sm:text-lg transition-all duration-150 select-none rounded-xl whitespace-nowrap px-3 sm:px-4',
        isActive
          ? 'bg-red-600 text-white shadow-md scale-105'
          : 'bg-zinc-900 text-zinc-400 hover:text-red-400',
      )}
      style={{ fontFamily: 'inherit' }}
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      role="tab"
    >
      {tab.label}
    </a>
  );
}

export default function StatsTabs({
  tabs,
  current,
  className,
  onTabClick,
}: StatsTabsProps) {
  const colClass = getColClass(tabs.length);

  return (
    <div
      className={cn(
        'w-full max-w-[320px] sm:max-w-md mx-auto grid h-10 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg',
        colClass,
        className,
      )}
      role="tablist"
      aria-orientation="horizontal"
      tabIndex={0}
      data-orientation="horizontal"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === current;
        const handleClick = (e: React.MouseEvent) => {
          if (onTabClick) {
            e.preventDefault();
            onTabClick(tab.key);
          }
        };
        return (
          <StatsTabButton
            key={tab.key}
            tab={tab}
            isActive={isActive}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
}
