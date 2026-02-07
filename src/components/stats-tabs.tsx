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
        'flex items-center justify-center h-full w-full text-center',
        'font-medium text-sm',
        'transition-all duration-300 select-none',
        'rounded-xl whitespace-nowrap px-4',
        isActive
          ? 'bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
          : 'text-gray-400 hover:text-white hover:bg-white/5',
      )}
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
        'w-full max-w-md mx-auto',
        'grid h-12 p-1.5 gap-1',
        'rounded-2xl',
        'bg-black/40 backdrop-blur-xl backdrop-saturate-150',
        'border border-white/10',
        'shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
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
