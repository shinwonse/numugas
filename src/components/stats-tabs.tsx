'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';

interface StatsTab {
  key: string;
  label: string;
  href?: string;
  /** 동적 페이지 데이터까지 미리 받아 탭 전환을 즉시 처리 */
  prefetch?: boolean;
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
  const className = cn(
    'relative flex items-center justify-center h-full w-full text-center cursor-pointer',
    'font-medium text-sm',
    'transition-all duration-300 ease-out select-none',
    'rounded-sm whitespace-nowrap px-2 sm:px-5',
    isActive ? 'text-white' : 'text-white/50 hover:text-white/80',
  );
  const content = <span className="relative z-10">{tab.label}</span>;

  // href가 있으면 클라이언트 내비게이션(전체 새로고침 없이 loading.tsx 스켈레톤 표시)
  if (tab.href) {
    return (
      <Link
        href={tab.href}
        prefetch={tab.prefetch}
        onClick={onClick}
        className={className}
        aria-selected={isActive}
        role="tab"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-selected={isActive}
      role="tab"
    >
      {content}
    </button>
  );
}

export default function StatsTabs({
  tabs,
  current,
  className,
  onTabClick,
}: StatsTabsProps) {
  const colClass = getColClass(tabs.length);
  const activeIndex = tabs.findIndex((tab) => tab.key === current);

  return (
    <div
      className={cn(
        'w-full max-w-sm mx-auto',
        'relative grid h-11 p-1 gap-1',
        // 안쪽 탭(4px) + 여백 p-1(4px) = 8px
        'rounded-lg',
        'bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150',
        'border border-white/[0.06]',
        'shadow-[0_2px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]',
        colClass,
        className,
      )}
      role="tablist"
      aria-orientation="horizontal"
      data-orientation="horizontal"
    >
      {/* 선택 표시가 탭 사이를 미끄러지듯 옮겨 간다 (칸 너비 + gap 4px만큼씩) */}
      {activeIndex >= 0 && (
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 rounded-sm border border-red-500/30 bg-gradient-to-b from-red-500/25 to-red-600/10 shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `calc((100% - 8px - ${String((tabs.length - 1) * 4)}px) / ${String(tabs.length)})`,
            transform: `translateX(calc(${String(activeIndex)} * (100% + 4px)))`,
          }}
        />
      )}
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
