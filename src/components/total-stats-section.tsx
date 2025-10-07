'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import StatsTabs from './stats-tabs';

interface Player {
  rank: number;
  name: string;
  team: string;
  value: number;
}

interface Stat {
  category: string;
  players: Player[];
}

interface TotalStatsSectionProps {
  battingStats: Stat[];
  pitchingStats: Stat[];
}

export function TotalStatsSection({
  battingStats,
  pitchingStats,
}: TotalStatsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // 탭 상태 관리
  const [currentTab, setCurrentTab] = useState<'batting' | 'pitching'>(
    'batting',
  );
  const tabs = [
    { key: 'batting', label: '타자 통산 기록' },
    { key: 'pitching', label: '투수 통산 기록' },
  ];

  return (
    <motion.section
      id="통산기록"
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="py-32 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display text-white tracking-tight"
          >
            통산 주요 기록
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto"
          >
            통산 주요 지표별 상위 선수들의 기록을 확인하세요.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <StatsTabs
            tabs={tabs}
            current={currentTab}
            onTabClick={(key) => setCurrentTab(key as 'batting' | 'pitching')}
            className="mb-12"
          />
          {currentTab === 'batting' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {battingStats.map((stat, statIndex) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: statIndex * 0.12,
                    ease: 'backOut',
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="bg-black/20 border-white/5 hover:border-red-500/30 transition-all duration-300">
                    <CardHeader className="pb-4 border-b border-white/5">
                      <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-career-batting`}
                          className={`flex items-center justify-between px-6 py-5 ${
                            playerIndex !== stat.players.length - 1
                              ? 'border-b border-white/5'
                              : ''
                          } ${player.team === 'RED DRAGONS' ? 'bg-red-500/5' : ''} hover:bg-white/5 transition-colors`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                player.rank === 1
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-500'
                              }`}
                            >
                              {player.rank}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white mb-0.5">
                                {player.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {player.team}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              {player.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {currentTab === 'pitching' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {pitchingStats.map((stat, statIndex) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: statIndex * 0.12,
                    ease: 'backOut',
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="bg-black/20 border-white/5 hover:border-red-500/30 transition-all duration-300">
                    <CardHeader className="pb-4 border-b border-white/5">
                      <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-career-pitching`}
                          className={`flex items-center justify-between px-6 py-5 ${
                            playerIndex !== stat.players.length - 1
                              ? 'border-b border-white/5'
                              : ''
                          } ${player.team === 'RED DRAGONS' ? 'bg-red-500/5' : ''} hover:bg-white/5 transition-colors`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                player.rank === 1
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-500'
                              }`}
                            >
                              {player.rank}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white mb-0.5">
                                {player.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {player.team}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              {player.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
