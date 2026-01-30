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

interface PlayerStatsSectionProps {
  battingStats: Stat[];
  pitchingStats: Stat[];
}

// 데이터가 비어있는지 확인하는 헬퍼 함수
function isStatsEmpty(stats: Stat[]): boolean {
  if (!stats || stats.length === 0) return true;
  // 모든 선수의 이름이 '-'이거나 value가 0인 경우도 빈 데이터로 처리
  return stats.every((stat) =>
    stat.players.every((player) => player.name === '-' || player.value === 0),
  );
}

// 시즌 준비 중 UI 컴포넌트
function SeasonComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">26</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">2026 시즌 준비 중</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">
        새로운 시즌이 곧 시작됩니다.
        <br />
        시즌이 시작되면 선수들의 기록이 업데이트됩니다.
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span>시즌 개막 대기 중</span>
      </div>
    </div>
  );
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

  // 데이터 존재 여부 확인
  const isBattingEmpty = isStatsEmpty(battingStats);
  const isPitchingEmpty = isStatsEmpty(pitchingStats);

  return (
    <motion.section
      id="선수기록"
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <SectionBackground variant="dots" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <SectionTitle
          subtitle="SEASON LEADERS 2026"
          title={
            <>
              2026 시즌 <span className="text-red-500">주요 기록</span>
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
          {currentTab === 'batting' &&
            (isBattingEmpty ? (
              <SeasonComingSoon />
            ) : (
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
            ))}
          {currentTab === 'pitching' &&
            (isPitchingEmpty ? (
              <SeasonComingSoon />
            ) : (
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
            ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
