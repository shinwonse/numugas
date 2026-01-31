'use client';

import { SectionBackground } from '@/components/animated/section-background';
import { useBatterStats, usePitcherStats } from '@/hooks/use-player-stats';
import Image from 'next/image';
import { useState } from 'react';

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

      {/* Responsive Player Header: full width, flex on large screens */}
      <section className="relative z-10 w-full mb-12">
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-red-900/20">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto relative">
              <div className="w-40 h-40 md:w-48 md:h-48 relative rounded-full overflow-hidden border-4 border-red-500 shadow-2xl shadow-red-500/50">
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 192px"
                  priority
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 to-transparent rounded-full blur-2xl -z-10" />
            </div>
            <div className="flex flex-col justify-center items-center md:items-start flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-3 font-display flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <span className="text-red-500 text-5xl md:text-7xl">
                  #{player.number}
                </span>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {player.name}
                </span>
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-500/30 rounded-full text-lg md:text-xl text-red-300">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {player.position}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="relative z-10 w-full mb-8">
        <div className="flex justify-center">
          <div className="flex bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1.5 shadow-xl">
            <button
              onClick={() => handleTabChange('batter')}
              className={`relative px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg ${
                activeTab === 'batter'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              타자 기록
            </button>
            <button
              onClick={() => handleTabChange('pitcher')}
              className={`relative px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg ${
                activeTab === 'pitcher'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              투수 기록
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
                {/* Highlight Stats Cards - 통산 기록이 있는 경우에만 표시 */}
                {batterStats && batterStats.careerStats && (
                  <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {batterStats.careerStats.avg}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        타율
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {batterStats.careerStats.homeruns}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        홈런
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {batterStats.careerStats.rbi}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        타점
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {batterStats.careerStats.hits}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        안타
                      </div>
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
                {/* Pitcher Highlight Stats Cards */}
                {pitcherStats && pitcherStats.careerStats && (
                  <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {pitcherStats.careerStats.era}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        평균자책점
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {pitcherStats.careerStats.wins}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        승
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {pitcherStats.careerStats.strikeouts}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        삼진
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                        {pitcherStats.careerStats.whip}
                      </div>
                      <div className="text-sm text-gray-400 font-semibold">
                        WHIP
                      </div>
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

                {/* Pitcher Career Stats Detailed Table */}
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
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
