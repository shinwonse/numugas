'use client';

import { SectionBackground } from '@/components/animated/section-background';
import { cn } from '@/lib/cn';
import { useBatterStats, usePitcherStats } from '@/hooks/use-player-stats';
import { BatterStatsChart, PitcherStatsChart } from './player-stats-chart';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

export function PlayerDetailContent({ player }: { player: Player }) {
  const [activeTab, setActiveTab] = useState<'batter' | 'pitcher'>('batter');
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // React Query 훅 사용 - 필요할 때만 데이터 fetching
  const { data: batterStats, error: batterError } = useBatterStats(
    player.number,
  );

  const { data: pitcherStats, error: pitcherError } = usePitcherStats(
    player.number,
  );

  const handleTabChange = (tab: 'batter' | 'pitcher') => {
    setActiveTab(tab);
  };

  return (
    <main className="relative min-h-screen bg-black text-white py-8 md:py-16 px-4 sm:px-8 md:px-16 lg:px-32 overflow-hidden">
      <SectionBackground variant="dots" />

      {/* Compact Player Header */}
      <section className="relative z-10 w-full mb-6">
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setPhotoOpen(true)}
            className="flex-shrink-0 relative group cursor-pointer"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 relative rounded-full overflow-hidden border-2 border-red-500/60 transition-all duration-200 group-hover:border-red-400 group-hover:shadow-lg group-hover:shadow-red-500/30">
              <Image
                src={player.photo}
                alt={player.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="112px"
                priority
              />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-baseline gap-2">
              <span className="text-red-500">#{player.number}</span>
              <span className="text-white truncate">{player.name}</span>
              <span className="text-sm md:text-base font-normal text-gray-500 ml-1">
                {player.position}
              </span>
            </h1>
          </div>
          <div className="flex bg-gray-900/80 border border-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => handleTabChange('batter')}
              className={cn(
                'px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold',
                activeTab === 'batter'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/40'
                  : 'text-gray-400 hover:text-white',
              )}
            >
              타자
            </button>
            <button
              onClick={() => handleTabChange('pitcher')}
              className={cn(
                'px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold',
                activeTab === 'pitcher'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/40'
                  : 'text-gray-400 hover:text-white',
              )}
            >
              투수
            </button>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full space-y-8">
        {/* Batter Stats */}
        {activeTab === 'batter' && (
          <>
            {batterError ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-400">
                  타자 기록을 불러오는데 실패했습니다.
                </div>
              </div>
            ) : (
              <>
                {/* Career Stats Detailed Table */}
                {batterStats && batterStats.careerStats && (
                  <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                      통산 기록
                    </h2>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-center min-w-[800px]">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-300">
                            <th className="py-3 px-3 text-sm font-semibold">
                              경기
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              타율
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              출루율
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              장타율
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              타석
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              타수
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              안타
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              홈런
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              득점
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              타점
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              도루
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              볼넷
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              삼진
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="py-4 px-3 font-bold text-white">
                              {batterStats.careerStats.games}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {batterStats.careerStats.avg}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {batterStats.careerStats.onbasepercentage}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {batterStats.careerStats.sluggingpercentage}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.plateappearances}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.atbats}
                            </td>
                            <td className="py-4 px-3 font-bold text-white">
                              {batterStats.careerStats.hits}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {batterStats.careerStats.homeruns}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.runs}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {batterStats.careerStats.rbi}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.stolenbases}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.walks}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {batterStats.careerStats.strikeouts}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Detailed Yearly Stats Table */}
                <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                    연도별 기록
                  </h2>
                  {batterStats && batterStats.seasonStats.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-center min-w-[1200px]">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-300">
                            <th className="py-3 px-2 text-sm font-semibold sticky left-0 bg-black/80">
                              연도
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              경기
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              타율
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              출루율
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              장타율
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              타석
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              타수
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              안타
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              1루타
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              2루타
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              3루타
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              홈런
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              득점
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              타점
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              루타
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              도루
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              도루실패
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              볼넷
                            </th>
                            <th className="py-3 px-2 text-sm font-semibold">
                              삼진
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {batterStats.seasonStats.map((stat) => {
                            const avg = stat.atbats
                              ? (stat.hits / stat.atbats).toFixed(3)
                              : '0.000';
                            const onbase =
                              stat.atbats +
                              stat.walks +
                              stat.hitbypitch +
                              stat.sacrificeflies;
                            const onbasePercentage = onbase
                              ? (
                                  (stat.hits + stat.walks + stat.hitbypitch) /
                                  onbase
                                ).toFixed(3)
                              : '0.000';
                            const sluggingPercentage = stat.atbats
                              ? (stat.totalbases / stat.atbats).toFixed(3)
                              : '0.000';

                            return (
                              <tr
                                key={stat.season}
                                className="border-b border-gray-800 hover:bg-red-950/20 transition-colors"
                              >
                                <td className="py-3 px-2 font-bold text-red-400 sticky left-0 bg-black/80">
                                  {stat.season}
                                </td>
                                <td className="py-3 px-2">{stat.games || 0}</td>
                                <td className="py-3 px-2 font-semibold">
                                  {avg}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {onbasePercentage}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {sluggingPercentage}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.plateappearances || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.atbats || 0}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.hits || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.singles || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.doubles || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.triples || 0}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.homeruns || 0}
                                </td>
                                <td className="py-3 px-2">{stat.runs || 0}</td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.rbi || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.totalbases || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.stolenbases || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.caughtstealing || 0}
                                </td>
                                <td className="py-3 px-2">{stat.walks || 0}</td>
                                <td className="py-3 px-2">
                                  {stat.strikeouts || 0}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-gray-400 text-center">
                      연도별 기록이 없습니다.
                    </div>
                  )}
                </section>

                {/* Stats Trend Chart */}
                {batterStats && batterStats.seasonStats.length > 0 && (
                  <BatterStatsChart seasonStats={batterStats.seasonStats} />
                )}
              </>
            )}
          </>
        )}

        {/* Pitcher Stats */}
        {activeTab === 'pitcher' && (
          <>
            {pitcherError ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-400">
                  투수 기록을 불러오는데 실패했습니다.
                </div>
              </div>
            ) : (
              <>
                {/* Pitcher Career Stats Table */}
                {pitcherStats && pitcherStats.careerStats && (
                  <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                      통산 기록
                    </h2>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-center min-w-[800px]">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-300">
                            <th className="py-3 px-3 text-sm font-semibold">
                              경기
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              평균자책
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              승
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              패
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              세이브
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              홀드
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              승률
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              이닝
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              피안타
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              볼넷
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              삼진
                            </th>
                            <th className="py-3 px-3 text-sm font-semibold">
                              WHIP
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="py-4 px-3 font-bold text-white">
                              {pitcherStats.careerStats.games}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {pitcherStats.careerStats.era}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {pitcherStats.careerStats.wins}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {pitcherStats.careerStats.losses}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {pitcherStats.careerStats.saves}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {pitcherStats.careerStats.holds}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {pitcherStats.careerStats.winrate}
                            </td>
                            <td className="py-4 px-3 font-bold text-white">
                              {pitcherStats.careerStats.innings}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {pitcherStats.careerStats.hits}
                            </td>
                            <td className="py-4 px-3 font-semibold">
                              {pitcherStats.careerStats.walks}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {pitcherStats.careerStats.strikeouts}
                            </td>
                            <td className="py-4 px-3 font-bold text-white text-lg">
                              {pitcherStats.careerStats.whip}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Detailed Yearly Pitcher Stats Table */}
                <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                    연도별 기록
                  </h2>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-center min-w-[1400px]">
                      <thead>
                        <tr className="border-b border-gray-700 text-gray-300">
                          <th className="py-3 px-2 text-sm font-semibold sticky left-0 bg-black/80">
                            연도
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            경기
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            평균자책
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            승
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            패
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            세이브
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            홀드
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            승률
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            이닝
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            타자
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            투구수
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            피안타
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            피홈런
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            볼넷
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            삼진
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            실점
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            자책
                          </th>
                          <th className="py-3 px-2 text-sm font-semibold">
                            WHIP
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pitcherStats && pitcherStats.seasonStats.length > 0 ? (
                          pitcherStats.seasonStats.map((stat) => {
                            return (
                              <tr
                                key={stat.season}
                                className="border-b border-gray-800 hover:bg-red-950/20 transition-colors"
                              >
                                <td className="py-3 px-2 font-bold text-red-400 sticky left-0 bg-black/80">
                                  {stat.season}
                                </td>
                                <td className="py-3 px-2">{stat.games || 0}</td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.era || '0.00'}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.wins || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.losses || 0}
                                </td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.saves || 0}
                                </td>
                                <td className="py-3 px-2">{stat.holds || 0}</td>
                                <td className="py-3 px-2">
                                  {stat.winrate || '0.000'}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.innings || '0.0'}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.batters || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.pitches || 0}
                                </td>
                                <td className="py-3 px-2">{stat.hits || 0}</td>
                                <td className="py-3 px-2">
                                  {stat.homeruns || 0}
                                </td>
                                <td className="py-3 px-2">{stat.walks || 0}</td>
                                <td className="py-3 px-2 font-semibold">
                                  {stat.strikeouts || 0}
                                </td>
                                <td className="py-3 px-2">{stat.runs || 0}</td>
                                <td className="py-3 px-2">
                                  {stat.earnedruns || 0}
                                </td>
                                <td className="py-3 px-2">
                                  {stat.whip || '0.000'}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={18} className="py-8 text-gray-400">
                              연도별 기록이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Pitcher Stats Trend Chart */}
                {pitcherStats && pitcherStats.seasonStats.length > 0 && (
                  <PitcherStatsChart seasonStats={pitcherStats.seasonStats} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Photo Lightbox */}
      {photoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPhotoOpen(false)}
        >
          <div className="relative w-[80vw] max-w-md aspect-square">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover rounded-2xl"
              sizes="80vw"
            />
          </div>
        </div>
      )}
    </main>
  );
}
