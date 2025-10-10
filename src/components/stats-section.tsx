'use client';

import { SectionBackground } from '@/components/animated/section-background';
import { SectionTitle } from '@/components/animated/section-title';
import { ShimmerCard } from '@/components/animated/shimmer-card';
import { SpotlightCard } from '@/components/animated/spotlight-card';
import { Card, CardContent } from '@/components/ui/card';
import { useCountAnimation } from '@/hooks/use-count-animation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatsSectionProps {
  teamTotalStats: {
    win_rate: string;
    win: number;
    lose: number;
    draw: number;
  };
  teamCareerStats: {
    homeruns: number;
    totalbases: number;
    hits: number;
    strikeouts: number;
  };
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
        <Card className="bg-black/20 border-white/5 hover:border-red-500/50 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <div className="text-5xl md:text-6xl font-bold text-white tracking-tighter group-hover:text-red-400 transition-colors duration-300">
                {animatedValue}
              </div>
              <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const teamStats = [
    {
      name: '승률',
      value: teamTotalStats.win_rate,
      description: '',
    },
    {
      name: '승',
      value: teamTotalStats.win,
      description: '',
    },
    {
      name: '패',
      value: teamTotalStats.lose,
      description: '',
    },
    {
      name: '무',
      value: teamTotalStats.draw,
      description: '',
    },
    {
      name: '팀통산홈런',
      value: teamCareerStats.homeruns,
      description: '',
    },
    {
      name: '팀통산루타',
      value: teamCareerStats.totalbases,
      description: '',
    },
    {
      name: '팀통산안타',
      value: teamCareerStats.hits,
      description: '',
    },
    {
      name: '팀통산탈삼진',
      value: teamCareerStats.strikeouts,
      description: '',
    },
  ];

  return (
    <motion.section
      id="통계"
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <SectionBackground variant="dots" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <SectionTitle
          subtitle="TEAM STATISTICS"
          title={
            <>
              팀 <span className="text-red-500">통산 기록</span>
            </>
          }
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
      </div>
    </motion.section>
  );
}
