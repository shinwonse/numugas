'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBattingCareerStats } from '@/hooks/use-batting-stats';
import { usePitchingCareerStats } from '@/hooks/use-pitching-stats';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import StatsTabs from './stats-tabs';

export function TotalStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const {
    battingStats: totalBattingStats,
    loading: battingLoading,
    error: battingError,
  } = useBattingCareerStats();
  const {
    pitchingStats: totalPitchingStats,
    loading: pitchingLoading,
    error: pitchingError,
  } = usePitchingCareerStats();

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
            <span className="text-red-600">통산 주요</span> 기록
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
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
            className="mb-8"
          />
          {currentTab === 'batting' &&
            (battingLoading ? (
              <div className="text-center py-12 text-gray-400">
                기록을 불러오는 중...
              </div>
            ) : battingError ? (
              <div className="text-center py-12 text-red-500">
                {battingError}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {totalBattingStats.map((stat, statIndex) => (
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
                    <Card className="bg-black/60 border-white/10 hover:border-red-400/60 shadow-xl shadow-red-400/10 transition-all duration-300">
                      <CardHeader className="bg-transparent pb-2">
                        <CardTitle className="text-xl">
                          {stat.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {stat.players.map((player, playerIndex) => (
                          <div
                            key={player.rank}
                            className={`flex items-center justify-between p-4 ${
                              playerIndex !== stat.players.length - 1
                                ? 'border-b border-gray-800'
                                : ''
                            } ${player.team === 'RED DRAGONS' ? 'bg-red-950/30' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  player.rank === 1
                                    ? 'bg-yellow-500'
                                    : player.rank === 2
                                      ? 'bg-gray-400'
                                      : 'bg-amber-700'
                                } text-black font-bold text-sm`}
                              >
                                {player.rank}
                              </div>
                              <div>
                                <p className="font-medium">{player.name}</p>
                                <p className="text-xs text-gray-400">
                                  {player.team}
                                </p>
                              </div>
                            </div>
                            <div className="text-xl font-bold text-red-500">
                              {stat.category.includes('타율')
                                ? player.value.toFixed(3)
                                : player.value}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ))}
          {currentTab === 'pitching' &&
            (pitchingLoading ? (
              <div className="text-center py-12 text-gray-400">
                기록을 불러오는 중...
              </div>
            ) : pitchingError ? (
              <div className="text-center py-12 text-red-500">
                {pitchingError}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {totalPitchingStats.map((stat, statIndex) => (
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
                    <Card className="bg-black/60 border-white/10 hover:border-red-400/60 shadow-xl shadow-red-400/10 transition-all duration-300">
                      <CardHeader className="bg-transparent pb-2">
                        <CardTitle className="text-xl">
                          {stat.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {stat.players.map((player, playerIndex) => (
                          <div
                            key={player.rank}
                            className={`flex items-center justify-between p-4 ${
                              playerIndex !== stat.players.length - 1
                                ? 'border-b border-gray-800'
                                : ''
                            } ${player.team === 'RED DRAGONS' ? 'bg-red-950/30' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  player.rank === 1
                                    ? 'bg-yellow-500'
                                    : player.rank === 2
                                      ? 'bg-gray-400'
                                      : 'bg-amber-700'
                                } text-black font-bold text-sm`}
                              >
                                {player.rank}
                              </div>
                              <div>
                                <p className="font-medium">{player.name}</p>
                                <p className="text-xs text-gray-400">
                                  {player.team}
                                </p>
                              </div>
                            </div>
                            <div className="text-xl font-bold text-red-500">
                              {stat.category.includes('평균자책')
                                ? player.value.toFixed(2)
                                : player.value}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
