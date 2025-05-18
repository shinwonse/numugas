'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBattingStats2025 } from '@/hooks/use-batting-stats';
import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useRef } from 'react';

// 타자 기록 데이터 제거
// const battingStats = [...];

// 투수 기록 데이터
const pitchingStats = [
  {
    category: '평균자책점',
    players: [
      { rank: 1, name: '김현수', value: 2.31, team: 'RED DRAGONS' },
      { rank: 2, name: '이준호', value: 2.45, team: 'GOLDEN LIONS' },
      { rank: 3, name: '박성민', value: 2.67, team: 'BLUE TIGERS' },
    ],
  },
  {
    category: '승리',
    players: [
      { rank: 1, name: '김현수', value: 18, team: 'RED DRAGONS' },
      { rank: 2, name: '이준호', value: 16, team: 'GOLDEN LIONS' },
      { rank: 3, name: '정민우', value: 15, team: 'RED DRAGONS' },
    ],
  },
  {
    category: '탈삼진',
    players: [
      { rank: 1, name: '정민우', value: 215, team: 'RED DRAGONS' },
      { rank: 2, name: '김현수', value: 198, team: 'RED DRAGONS' },
      { rank: 3, name: '최재원', value: 187, team: 'PURPLE PANTHERS' },
    ],
  },
  {
    category: '세이브',
    players: [
      { rank: 1, name: '박지훈', value: 32, team: 'RED DRAGONS' },
      { rank: 2, name: '최재원', value: 28, team: 'PURPLE PANTHERS' },
      { rank: 3, name: '이준호', value: 24, team: 'GOLDEN LIONS' },
    ],
  },
];

export function PlayerStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // 2025시즌 타자 기록 fetch (커스텀 훅 사용)
  const { battingStats, loading, error } = useBattingStats2025();

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
            className="text-3xl md:text-5xl font-bold mb-4 font-display"
          >
            <span className="text-red-600">2025시즌 주요</span> 기록
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            주요 지표별 리그 상위 선수들의 기록을 확인하세요.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <Tabs defaultValue="batting" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="batting" className="text-lg py-3">
                타자 기록
              </TabsTrigger>
              <TabsTrigger value="pitching" className="text-lg py-3">
                투수 기록
              </TabsTrigger>
            </TabsList>
            <TabsContent value="batting" className="mt-0">
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  기록을 불러오는 중...
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
              ) : (
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
                                {stat.category === '타율'
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
              )}
            </TabsContent>
            <TabsContent value="pitching" className="mt-0">
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
                              {typeof player.value === 'number' &&
                              player.value % 1 === 0
                                ? player.value
                                : player.value.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full text-red-400 border border-red-600/30">
            <Trophy size={18} />
            <span>
              RED DRAGONS 소속 선수들이 다수의 기록에서 상위권을 차지하고
              있습니다!
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
