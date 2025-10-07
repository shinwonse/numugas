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

interface PlayerStatsSectionProps {
  battingStats: Stat[];
  pitchingStats: Stat[];
}

export function PlayerStatsSection({
  battingStats,
  pitchingStats,
}: PlayerStatsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // 탭 상태 관리
  const [currentTab, setCurrentTab] = useState<'batting' | 'pitching'>(
    'batting',
  );
  const tabs = [
    { key: 'batting', label: '타자 기록' },
    { key: 'pitching', label: '투수 기록' },
  ];

  return (
    <motion.section
      id="선수기록"
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
            2025 시즌 선수 기록
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-gray-500 max-w-2xl mx-auto"
          >
            2025 시즌 타자와 투수의 주요 기록을 확인하세요.
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
            className="mb-8"
          />
          {currentTab === 'batting' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <Card className="bg-black/40 border-white/5 hover:border-red-500/50 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-white">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-batting`}
                          className={`flex items-center justify-between p-4 ${
                            playerIndex !== stat.players.length - 1
                              ? 'border-b border-white/5'
                              : ''
                          } ${player.team === 'RED DRAGONS' ? 'bg-red-500/5' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                player.rank === 1
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {player.rank}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {player.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {player.team}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <Card className="bg-black/40 border-white/5 hover:border-red-500/50 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-white">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-pitching`}
                          className={`flex items-center justify-between p-4 ${
                            playerIndex !== stat.players.length - 1
                              ? 'border-b border-white/5'
                              : ''
                          } ${player.team === 'RED DRAGONS' ? 'bg-red-500/5' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                player.rank === 1
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {player.rank}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {player.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {player.team}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white">
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
