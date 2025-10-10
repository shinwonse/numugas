'use client';

import { SectionBackground } from '@/components/animated/section-background';
import { SectionTitle } from '@/components/animated/section-title';
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
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <SectionBackground variant="gradient" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <SectionTitle
          subtitle="ALL-TIME LEADERS"
          title={
            <>
              역대 <span className="text-red-500">통산 기록</span>
            </>
          }
          isInView={isInView}
        />
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
                </ShimmerCard>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
