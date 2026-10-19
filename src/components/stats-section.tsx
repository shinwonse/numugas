'use client';

import { SectionTitle } from '@/components/animated/section-title';
import { ShimmerCard } from '@/components/animated/shimmer-card';
import { SpotlightCard } from '@/components/animated/spotlight-card';
import { Card, CardContent } from '@/components/ui/card';
import { useCountAnimation } from '@/hooks/use-count-animation';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/cn';
import { TEAM_STATS_HREF } from '@/lib/opponents';
import type { TeamCareerStats } from '@/types/stats';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface StatsSectionProps {
  teamTotalStats: {
    win_rate: string;
    win: number;
    lose: number;
    draw: number;
  };
  teamCareerStats: TeamCareerStats;
}

interface StatCardProps {
  name: string;
  value: number | string;
  index: number;
  isInView: boolean;
}

function StatCard({ name, value, index, isInView }: StatCardProps) {
  const animatedValue = useCountAnimation({
    end: value,
    isInView,
  });

  return (
    <ShimmerCard delay={index * 0.12}>
      <SpotlightCard>
        <Card
          className={cn(
            'group cursor-default',
            'bg-white/5 backdrop-blur-xl backdrop-saturate-150',
            'border border-white/10',
            'rounded-2xl',
            'transition-all duration-500',
            'hover:bg-white/10 hover:border-white/20',
            'hover:shadow-[0_8px_32px_rgba(239,68,68,0.15)]',
          )}
        >
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <div
                className={cn(
                  'text-5xl md:text-6xl font-bold tracking-tighter',
                  'text-white',
                  'transition-colors duration-300',
                  'group-hover:text-red-400',
                )}
              >
                {animatedValue}
              </div>
              <div
                className={cn(
                  'text-xs md:text-sm font-medium uppercase tracking-wider',
                  'text-gray-400',
                  'transition-colors duration-300',
                  'group-hover:text-gray-200',
                )}
              >
                {name}
              </div>
            </div>
          </CardContent>
        </Card>
      </SpotlightCard>
    </ShimmerCard>
  );
}

export function StatsSection({
  teamTotalStats,
  teamCareerStats,
}: StatsSectionProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });

  const teamStats = [
    { name: '승률', value: teamTotalStats.win_rate, description: '' },
    { name: '승', value: teamTotalStats.win, description: '' },
    { name: '패', value: teamTotalStats.lose, description: '' },
    { name: '무', value: teamTotalStats.draw, description: '' },
    { name: '팀통산홈런', value: teamCareerStats.homeruns, description: '' },
    { name: '팀통산루타', value: teamCareerStats.totalbases, description: '' },
    { name: '팀통산안타', value: teamCareerStats.hits, description: '' },
    { name: '팀통산탈삼진', value: teamCareerStats.strikeouts, description: '' },
  ];

  return (
    <section
      id="통계"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(80px)',
        transition: 'opacity 1s ease-out, transform 1s ease-out',
      }}
    >

      <div className="page-container relative z-10">
        <SectionTitle
          subtitle="TEAM STATISTICS"
          title="팀 통산 기록"
          isInView={isInView}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teamStats.map((stat, index) => (
            <StatCard
              key={stat.name}
              name={stat.name}
              value={stat.value}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href={TEAM_STATS_HREF}
            className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            시즌별 성적·상대 전적 보기
            <ChevronRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
