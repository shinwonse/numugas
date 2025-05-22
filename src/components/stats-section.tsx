'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTeamCareerStats } from '@/hooks/use-team-career-stats';
import { useTeamTotalStats } from '@/hooks/use-team-total-stats';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { data, error } = useTeamTotalStats();
  const {
    data: careerStats,
    error: careerError,
    isLoading: careerLoading,
  } = useTeamCareerStats();

  const teamStats = data
    ? [
        {
          name: '승률',
          value: data.win_rate,
          description: '',
          icon: '🏆',
        },
        {
          name: '승',
          value: data.win,
          description: '',
          icon: '🟢',
        },
        {
          name: '패',
          value: data.lose,
          description: '',
          icon: '🔴',
        },
        {
          name: '무',
          value: data.draw,
          description: '',
          icon: '⚪️',
        },
        ...(careerStats
          ? [
              {
                name: '팀통산홈런',
                value: careerStats.homeruns,
                description: '',
                icon: '💣',
              },
              {
                name: '팀통산루타',
                value: careerStats.totalbases,
                description: '',
                icon: '🦶',
              },
              {
                name: '팀통산안타',
                value: careerStats.hits,
                description: '',
                icon: '🥎',
              },
              {
                name: '팀통산탈삼진',
                value: careerStats.strikeouts,
                description: '',
                icon: '🔥',
              },
            ]
          : []),
      ]
    : [];

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
            className="text-3xl md:text-5xl font-bold mb-4 font-display"
          >
            <span className="text-red-600">팀 통산</span> 성적
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
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
              <Card className="bg-black/60 border-white/10 hover:border-red-400/60 shadow-xl shadow-red-400/10 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-3xl">{stat.icon}</span>
                    {stat.name}
                  </CardTitle>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-red-500">
                    {stat.name === '승률'
                      ? `${
                          typeof stat.value === 'number'
                            ? stat.value % 1 === 0
                              ? stat.value
                              : stat.value.toFixed(1)
                            : stat.value
                        }%`
                      : typeof stat.value === 'number' && stat.value % 1 === 0
                        ? stat.value
                        : stat.value.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
