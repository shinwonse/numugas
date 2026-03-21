'use client';

import StatsTabs from '@/components/stats-tabs';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface StatsPageHeaderProps {
  tabList: Array<{ key: string; label: string; href: string }>;
  currentType: string;
}

export function StatsPageHeader({
  tabList,
  currentType,
}: StatsPageHeaderProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center mb-10 md:mb-14"
    >
      {/* Glass badge */}
      <div
        className="mb-5 inline-flex"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(16px)',
          transition:
            'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Player Statistics
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 font-display tracking-tight"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(16px)',
          transition:
            'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
        }}
      >
        <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
          선수 기록{' '}
        </span>
        <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
          통계
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm md:text-base text-gray-500 mb-8"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(16px)',
          transition:
            'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
        }}
      >
        시즌별 타자/투수 상세 기록을 확인하세요
      </p>

      {/* Decorative line */}
      <div
        className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-red-500/60 to-transparent mb-8"
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.8s 0.25s',
        }}
      />

      {/* Tabs */}
      <div
        className="flex justify-center"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(16px)',
          transition:
            'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
        }}
      >
        <StatsTabs tabs={tabList} current={currentType} />
      </div>
    </div>
  );
}
