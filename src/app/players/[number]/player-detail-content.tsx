'use client';

import { cn } from '@/lib/cn';
import { BatterStatsChart, PitcherStatsChart } from './player-stats-chart';
import Image from 'next/image';
import { PlayerPhotoGallery } from './player-photo-gallery';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PLACEHOLDER_PHOTO = '/logo.webp';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  driveFolderId?: string | null;
  stats: Record<string, number>;
}

interface CareerData {
  seasonStats: any[];
  careerStats: Record<string, any> | null;
}

interface PlayerDetailContentProps {
  player: Player;
  batterCareer: CareerData;
  pitcherCareer: CareerData;
}

export function PlayerDetailContent({
  player,
  batterCareer,
  pitcherCareer,
}: PlayerDetailContentProps) {
  const [activeTab, setActiveTab] = useState<'batter' | 'pitcher'>('batter');
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const batterStats = batterCareer;
  const pitcherStats = pitcherCareer;
  const batterError: Error | null = null;
  const pitcherError: Error | null = null;

  const handleTabChange = (tab: 'batter' | 'pitcher') => {
    setActiveTab(tab);
  };

  const isPlaceholderPhoto = player.photo === PLACEHOLDER_PHOTO;
  const tabClass = (active: boolean) =>
    cn(
      'px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer',
      active
        ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
        : 'text-white/40 hover:text-white/80',
    );

  return (
    <main className="relative min-h-screen bg-[#050508] text-white overflow-x-clip">
      {/* 사진을 크게 흐려 배경 전체에 은은하게 깐다 */}
      {!isPlaceholderPhoto && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <Image
            src={player.photo}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-30 blur-3xl saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/30 via-[#050508]/75 to-[#050508]" />
        </div>
      )}

      <div className="relative z-10">
        {/* 사진: 모바일은 상단 히어로, 데스크톱은 좌측 고정 */}
        <div className="relative lg:fixed lg:inset-y-0 lg:left-0 lg:w-[36%]">
          <button
            type="button"
            aria-label={`${player.name} 프로필 사진 확대`}
            onClick={() => setPhotoOpen(true)}
            className="group relative block h-[64vh] min-h-[420px] w-full cursor-zoom-in overflow-hidden lg:h-full"
          >
            {/* 단색 그라데이션 대신 마스크로 투명하게 지워서, 뒤의 흐린 배경에 자연스럽게 녹아든다 */}
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)] lg:[mask-image:linear-gradient(to_right,black_50%,transparent_100%)]">
              <Image
                src={player.photo}
                alt={player.name}
                fill
                priority
                sizes="(min-width: 1024px) 36vw, 100vw"
                className={cn(
                  'transition-transform duration-700 ease-out group-hover:scale-[1.02]',
                  isPlaceholderPhoto
                    ? 'object-contain p-20 opacity-40'
                    : 'object-cover object-top',
                )}
              />
              {/* 붉은 톤 + 이름이 올라가는 하단 대비 */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-transparent mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:from-black/40" />
            </div>
            <span
              aria-hidden
              className="absolute bottom-8 left-8 hidden font-display text-[11rem] font-bold leading-none text-white/[0.08] lg:block"
            >
              {player.number}
            </span>
          </button>
        </div>

        <div className="-mt-28 px-4 pb-16 sm:px-8 lg:ml-[36%] lg:mt-0 lg:px-12 lg:pt-20 xl:px-16">
          {/* 이름 / 포지션 / 타자·투수 전환 */}
          <section className="relative mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              No. {player.number}
              <span className="mx-2 text-white/20">·</span>
              <span className="text-white/60">{player.position}</span>
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              {player.name}
            </h1>
            <div className="mt-6 inline-flex gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1 backdrop-blur-xl">
              <button
                type="button"
                aria-pressed={activeTab === 'batter'}
                onClick={() => handleTabChange('batter')}
                className={tabClass(activeTab === 'batter')}
              >
                타자
              </button>
              <button
                type="button"
                aria-pressed={activeTab === 'pitcher'}
                onClick={() => handleTabChange('pitcher')}
                className={tabClass(activeTab === 'pitcher')}
              >
                투수
              </button>
            </div>
          </section>

      <section aria-label="선수 기록" className="relative z-10 mb-8 w-full">
        <div className="space-y-5">
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
                    <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl md:p-6">
                      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                        통산 기록
                      </h2>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-center text-xs md:text-base min-w-[800px]">
                          <thead>
                            <tr className="border-b border-gray-700 text-gray-300">
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                경기
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                타율
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                출루율
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                장타율
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                타석
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                타수
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                안타
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                홈런
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                득점
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                타점
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                도루
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                볼넷
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                삼진
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-800">
                              <td className="py-4 px-3 font-bold text-white">
                                {batterStats.careerStats.games}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {batterStats.careerStats.avg}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {batterStats.careerStats.onbasepercentage}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
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
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {batterStats.careerStats.homeruns}
                              </td>
                              <td className="py-4 px-3 font-semibold">
                                {batterStats.careerStats.runs}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
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

                  <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 md:px-8 text-sm font-semibold text-gray-300 hover:text-white [&::-webkit-details-marker]:hidden">
                      세부 기록
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-6 border-t border-white/[0.08] pt-4">
                      {/* Detailed Yearly Stats Table */}
                      <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl md:p-6">
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                          연도별 기록
                        </h2>
                        {batterStats && batterStats.seasonStats.length > 0 ? (
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-center text-xs md:text-base min-w-[1200px]">
                              <thead>
                                <tr className="border-b border-gray-700 text-gray-300">
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold sticky left-0 bg-black/80">
                                    연도
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    경기
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    타율
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    출루율
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    장타율
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    타석
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    타수
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    안타
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    1루타
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    2루타
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    3루타
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    홈런
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    득점
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    타점
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    루타
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    도루
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    도루실패
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                    볼넷
                                  </th>
                                  <th className="py-3 px-2 text-xs md:text-sm font-semibold">
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
                                        (stat.hits +
                                          stat.walks +
                                          stat.hitbypitch) /
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
                                      <td className="py-3 px-2">
                                        {stat.games || 0}
                                      </td>
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
                                      <td className="py-3 px-2">
                                        {stat.runs || 0}
                                      </td>
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
                                      <td className="py-3 px-2">
                                        {stat.walks || 0}
                                      </td>
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
                        <BatterStatsChart
                          seasonStats={batterStats.seasonStats}
                        />
                      )}
                    </div>
                  </details>
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
                    <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl md:p-6">
                      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                        통산 기록
                      </h2>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-center text-xs md:text-base min-w-[800px]">
                          <thead>
                            <tr className="border-b border-gray-700 text-gray-300">
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                경기
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                평균자책
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                승
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                패
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                세이브
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                홀드
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                승률
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                이닝
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                피안타
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                볼넷
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                삼진
                              </th>
                              <th className="py-3 px-3 text-xs md:text-sm font-semibold">
                                WHIP
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-800">
                              <td className="py-4 px-3 font-bold text-white">
                                {pitcherStats.careerStats.games}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {pitcherStats.careerStats.era}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {pitcherStats.careerStats.wins}
                              </td>
                              <td className="py-4 px-3 font-semibold">
                                {pitcherStats.careerStats.losses}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
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
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {pitcherStats.careerStats.strikeouts}
                              </td>
                              <td className="py-4 px-3 font-bold text-white text-sm md:text-lg">
                                {pitcherStats.careerStats.whip}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 md:px-8 text-sm font-semibold text-gray-300 hover:text-white [&::-webkit-details-marker]:hidden">
                      세부 기록
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-6 border-t border-white/[0.08] pt-4">
                      {/* Detailed Yearly Pitcher Stats Table */}
                      <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl md:p-6">
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                          연도별 기록
                        </h2>
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-center text-xs md:text-base min-w-[1400px]">
                            <thead>
                              <tr className="border-b border-gray-700 text-gray-300">
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold sticky left-0 bg-black/80">
                                  연도
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  경기
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  평균자책
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  승
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  패
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  세이브
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  홀드
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  승률
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  이닝
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  타자
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  투구수
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  피안타
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  피홈런
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  볼넷
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  삼진
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  실점
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  자책
                                </th>
                                <th className="py-3 px-2 text-xs md:text-sm font-semibold">
                                  WHIP
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {pitcherStats &&
                              pitcherStats.seasonStats.length > 0 ? (
                                pitcherStats.seasonStats.map((stat) => {
                                  return (
                                    <tr
                                      key={stat.season}
                                      className="border-b border-gray-800 hover:bg-red-950/20 transition-colors"
                                    >
                                      <td className="py-3 px-2 font-bold text-red-400 sticky left-0 bg-black/80">
                                        {stat.season}
                                      </td>
                                      <td className="py-3 px-2">
                                        {stat.games || 0}
                                      </td>
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
                                      <td className="py-3 px-2">
                                        {stat.holds || 0}
                                      </td>
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
                                      <td className="py-3 px-2">
                                        {stat.hits || 0}
                                      </td>
                                      <td className="py-3 px-2">
                                        {stat.homeruns || 0}
                                      </td>
                                      <td className="py-3 px-2">
                                        {stat.walks || 0}
                                      </td>
                                      <td className="py-3 px-2 font-semibold">
                                        {stat.strikeouts || 0}
                                      </td>
                                      <td className="py-3 px-2">
                                        {stat.runs || 0}
                                      </td>
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
                                  <td
                                    colSpan={18}
                                    className="py-8 text-gray-400"
                                  >
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
                        <PitcherStatsChart
                          seasonStats={pitcherStats.seasonStats}
                        />
                      )}
                    </div>
                  </details>
                </>
              )}
            </>
          )}
        </div>
      </section>
      <PlayerPhotoGallery
        key={player.id}
        folderId={player.driveFolderId || undefined}
        playerName={player.name}
      />
        </div>
      </div>

      {/* Photo Lightbox */}
      {photoOpen && (
        <div
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={() => setPhotoOpen(false)}
        >
          <div className="relative h-[85dvh] w-[92vw] max-w-3xl">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-contain"
              sizes="92vw"
            />
          </div>
        </div>
      )}
    </main>
  );
}
