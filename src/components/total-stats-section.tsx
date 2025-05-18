'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// 임시 통산 타자 기록 데이터
const totalBattingStats = [
  {
    category: '통산 타율',
    players: [
      { rank: 1, name: '홍길동', team: 'RED DRAGONS', value: 0.345 },
      { rank: 2, name: '이순신', team: 'BLUE SHARKS', value: 0.332 },
      { rank: 3, name: '김철수', team: 'GREEN TIGERS', value: 0.325 },
    ],
  },
  {
    category: '통산 홈런',
    players: [
      { rank: 1, name: '박지성', team: 'RED DRAGONS', value: 412 },
      { rank: 2, name: '최강', team: 'YELLOW BEARS', value: 388 },
      { rank: 3, name: '이강인', team: 'BLUE SHARKS', value: 377 },
    ],
  },
  {
    category: '통산 안타',
    players: [
      { rank: 1, name: '손흥민', team: 'GREEN TIGERS', value: 2312 },
      { rank: 2, name: '홍길동', team: 'RED DRAGONS', value: 2201 },
      { rank: 3, name: '이순신', team: 'BLUE SHARKS', value: 2105 },
    ],
  },
  {
    category: '통산 도루',
    players: [
      { rank: 1, name: '이강인', team: 'BLUE SHARKS', value: 502 },
      { rank: 2, name: '박지성', team: 'RED DRAGONS', value: 488 },
      { rank: 3, name: '최강', team: 'YELLOW BEARS', value: 470 },
    ],
  },
];

// 임시 통산 투수 기록 데이터
const totalPitchingStats = [
  {
    category: '통산 승',
    players: [
      { rank: 1, name: '류현진', team: 'RED DRAGONS', value: 187 },
      { rank: 2, name: '김광현', team: 'BLUE SHARKS', value: 172 },
      { rank: 3, name: '양현종', team: 'GREEN TIGERS', value: 165 },
    ],
  },
  {
    category: '통산 탈삼진',
    players: [
      { rank: 1, name: '류현진', team: 'RED DRAGONS', value: 2450 },
      { rank: 2, name: '양현종', team: 'GREEN TIGERS', value: 2302 },
      { rank: 3, name: '김광현', team: 'BLUE SHARKS', value: 2255 },
    ],
  },
  {
    category: '통산 세이브',
    players: [
      { rank: 1, name: '오승환', team: 'YELLOW BEARS', value: 410 },
      { rank: 2, name: '정우람', team: 'BLUE SHARKS', value: 355 },
      { rank: 3, name: '손승락', team: 'RED DRAGONS', value: 340 },
    ],
  },
  {
    category: '통산 평균자책',
    players: [
      { rank: 1, name: '류현진', team: 'RED DRAGONS', value: 2.85 },
      { rank: 2, name: '김광현', team: 'BLUE SHARKS', value: 2.97 },
      { rank: 3, name: '양현종', team: 'GREEN TIGERS', value: 3.1 },
    ],
  },
];

export function TotalStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            통산 지표별 상위 선수들의 기록을 확인하세요.
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
                타자 통산 기록
              </TabsTrigger>
              <TabsTrigger value="pitching" className="text-lg py-3">
                투수 통산 기록
              </TabsTrigger>
            </TabsList>
            <TabsContent value="batting" className="mt-0">
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
            </TabsContent>
            <TabsContent value="pitching" className="mt-0">
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.section>
  );
}
