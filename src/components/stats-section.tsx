'use client';

import { Card, CardContent } from '@/components/ui/card';
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
      transition={{ duration: 1, ease: 'easeOut' }}
      className="py-32 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display text-white tracking-tight"
          >
            팀 통산 성적
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teamStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: 'backOut',
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="bg-black/20 border-white/5 hover:border-red-500/30 transition-all duration-300 group">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col gap-4">
                    <div className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {stat.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
