'use client';

import { ShimmerCard } from '@/components/animated/shimmer-card';
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
      viewport={{ once: true }}
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
            2025 시즌 선수 기록
          </motion.h2>
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
                <ShimmerCard key={stat.category} delay={statIndex * 0.12}>
                  <Card className="bg-black/20 border-white/5 hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <CardHeader className="pb-4 border-b border-white/5">
                      <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-batting`}
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
                </ShimmerCard>
              ))}
            </div>
          )}
          {currentTab === 'pitching' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {pitchingStats.map((stat, statIndex) => (
                <ShimmerCard key={stat.category} delay={statIndex * 0.12}>
                  <Card className="bg-black/20 border-white/5 hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <CardHeader className="pb-4 border-b border-white/5">
                      <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {stat.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {stat.players.map((player, playerIndex) => (
                        <div
                          key={`${stat.category}-${player.name}-pitching`}
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
                </ShimmerCard>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
