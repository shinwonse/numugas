'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-3 font-display text-white"
          >
            팀 통산 성적
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-gray-500 max-w-2xl mx-auto"
          >
            담장NUMUGAS의 통산 주요 성적입니다.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <Card className="bg-black/40 border-white/5 hover:border-red-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
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
