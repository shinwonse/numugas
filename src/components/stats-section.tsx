'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const teamStats = [
  {
    name: '승률',
    value: 0.625,
    description: '리그 2위',
    icon: '🏆',
  },
  {
    name: '홈런',
    value: 87,
    description: '리그 1위',
    icon: '💪',
  },
  {
    name: '도루',
    value: 112,
    description: '리그 3위',
    icon: '🏃',
  },
  {
    name: '평균자책점',
    value: 3.42,
    description: '리그 4위',
    icon: '⚾',
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            <span className="text-red-600">팀</span> 통계
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            레드 드래곤즈의 이번 시즌 주요 통계 데이터입니다.
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
                    {typeof stat.value === 'number' && stat.value % 1 === 0
                      ? stat.value
                      : stat.value.toFixed(3)}
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
