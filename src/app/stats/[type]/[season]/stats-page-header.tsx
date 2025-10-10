'use client';

import StatsTabs from '@/components/stats-tabs';
import { motion } from 'framer-motion';

interface StatsPageHeaderProps {
  tabList: Array<{ key: string; label: string; href: string }>;
  currentType: string;
}

export function StatsPageHeader({
  tabList,
  currentType,
}: StatsPageHeaderProps) {
  return (
    <div className="text-center mb-16 md:mb-20">
      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-red-500">
          PLAYER STATISTICS
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display text-white tracking-tight"
      >
        선수 기록 <span className="text-red-500">통계</span>
      </motion.h1>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mx-auto h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8"
      />

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center"
      >
        <StatsTabs tabs={tabList} current={currentType} />
      </motion.div>
    </div>
  );
}
