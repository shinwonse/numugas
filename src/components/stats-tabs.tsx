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
        'relative flex items-center justify-center h-full w-full text-center cursor-pointer',
        'font-medium text-sm',
        'transition-all duration-300 ease-out select-none',
        'rounded-xl whitespace-nowrap px-5',
        isActive
          ? 'bg-white/[0.12] text-white shadow-[0_1px_8px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]',
      )}
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      role="tab"
    >
      {isActive && (
        <span className="absolute inset-0 rounded-xl border border-white/[0.08]" />
      )}
      <span className="relative z-10">{tab.label}</span>
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
        'w-full max-w-sm mx-auto',
        'grid h-11 p-1 gap-1',
        'rounded-2xl',
        'bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150',
        'border border-white/[0.06]',
        'shadow-[0_2px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]',
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
