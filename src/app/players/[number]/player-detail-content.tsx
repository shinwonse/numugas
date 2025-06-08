'use client';

import { supabase } from '@/lib/supabase';
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

interface BatterSeasonStat {
  season: number;
  games: number;
  atbats: number;
  hits: number;
  plateappearances: number;
  runs: number;
  singles: number;
  doubles: number;
  triples: number;
  homeruns: number;
  totalbases: number;
  rbi: number;
  stolenbases: number;
  caughtstealing: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  doubleplays: number;
}

interface PitcherSeasonStat {
  season: number;
  games: number;
  era: string;
  wins: number;
  losses: number;
  saves: number;
  holds: number;
  winrate: string;
  innings: string;
  batters: number;
  atbats: number;
  pitches: number;
  hits: number;
  homeruns: number;
  sacrificehits: number;
  sacrificeflies: number;
  walks: number;
  intentionalwalks: number;
  hitbypitch: number;
  strikeouts: number;
  wildpitches: number;
  balks: number;
  runs: number;
  earnedruns: number;
  whip: string;
  opponent_avg: string;
  strikeout_rate: string;
}

interface BatterCareerApiResponse {
  seasonStats: BatterSeasonStat[];
  careerStats: Record<string, any> | null;
}

interface PitcherCareerApiResponse {
  seasonStats: PitcherSeasonStat[];
  careerStats: Record<string, any> | null;
}

async function fetchBatterCareerStats(
  number: number,
): Promise<BatterCareerApiResponse | null> {
  try {
    console.log('Fetching batter stats for player number:', number);

    // 1. 연도별 기록
    const { data: seasonStats, error: seasonError } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('back_number', number)
      .order('season', { ascending: true });

    console.log('Season stats result:', {
      data: seasonStats,
      error: seasonError,
      length: seasonStats?.length || 0,
    });

    if (seasonError) {
      console.error('Season stats error:', seasonError);
      return null;
    }

    if (!seasonStats || seasonStats.length === 0) {
      console.log('No season stats found for player number:', number);
      return {
        seasonStats: [],
        careerStats: null,
      };
    }

    // 2. 통산 기록 집계
    const sumFields = [
      'games',
      'plateappearances',
      'atbats',
      'runs',
      'hits',
      'singles',
      'doubles',
      'triples',
      'homeruns',
      'totalbases',
      'rbi',
      'stolenbases',
      'caughtstealing',
      'sacrificehits',
      'sacrificeflies',
      'walks',
      'intentionalwalks',
      'hitbypitch',
      'strikeouts',
      'doubleplays',
    ];

    const total: Record<string, number> = {};
    for (const field of sumFields) {
      total[field] = seasonStats.reduce(
        (acc, cur) => acc + Number(cur[field] ?? 0),
        0,
      );
    }

    // 타율, 출루율, 장타율 계산
    const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
    const onbase =
      total['atbats'] +
      total['walks'] +
      total['hitbypitch'] +
      total['sacrificeflies'];
    const onbasepercentage = onbase
      ? (total['hits'] + total['walks'] + total['hitbypitch']) / onbase
      : 0;
    const sluggingpercentage = total['atbats']
      ? total['totalbases'] / total['atbats']
      : 0;

    const careerStats = {
      number: number,
      name: seasonStats[0]?.name || '',
      ...total,
      avg: avg.toFixed(3),
      onbasepercentage: onbasepercentage.toFixed(3),
      sluggingpercentage: sluggingpercentage.toFixed(3),
    };

    console.log('Career stats calculated:', careerStats);
    return { seasonStats, careerStats };
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

async function fetchPitcherCareerStats(
  playerNumber: number,
): Promise<PitcherCareerApiResponse | null> {
  try {
    console.log('Fetching pitcher stats for player number:', playerNumber);

    // 1. 연도별 기록
    const { data: seasonStats, error: seasonError } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('back_number', playerNumber)
      .order('season', { ascending: true });

    console.log('Pitcher season stats result:', {
      data: seasonStats,
      error: seasonError,
      length: seasonStats?.length || 0,
    });

    if (seasonError) {
      console.error('Pitcher season stats error:', seasonError);
      return null;
    }

    if (!seasonStats || seasonStats.length === 0) {
      console.log(
        'No pitcher season stats found for player number:',
        playerNumber,
      );
      return {
        seasonStats: [],
        careerStats: null,
      };
    }

    // 2. 통산 기록 집계
    const sumFields = [
      'games',
      'wins',
      'losses',
      'saves',
      'holds',
      'batters',
      'atbats',
      'pitches',
      'hits',
      'homeruns',
      'sacrificehits',
      'sacrificeflies',
      'walks',
      'intentionalwalks',
      'hitbypitch',
      'strikeouts',
      'wildpitches',
      'balks',
      'runs',
      'earnedruns',
    ];

    const total: Record<string, number> = {};
    for (const field of sumFields) {
      total[field] = seasonStats.reduce(
        (acc, cur) => acc + Number(cur[field] ?? 0),
        0,
      );
    }

    // 이닝 합산 (ex: "12.2" -> 12 + 2/3)
    function parseInning(inn: string) {
      if (!inn) return 0;
      const [whole, frac] = String(inn).split('.');
      return Number(whole) + (frac ? Number(frac) / 3 : 0);
    }
    const totalInnings = seasonStats.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );

    // ERA, WHIP, 승률, 피안타율, 탈삼진율 계산
    const era = totalInnings ? (total['earnedruns'] * 9) / totalInnings : 0;
    const whip = totalInnings
      ? (total['walks'] + total['hits']) / totalInnings
      : 0;
    const winrate =
      total['wins'] + total['losses'] > 0
        ? total['wins'] / (total['wins'] + total['losses'])
        : 0;
    const opponent_avg =
      total['atbats'] > 0 ? total['hits'] / total['atbats'] : 0;
    const strikeout_rate =
      total['batters'] > 0 ? (total['strikeouts'] / total['batters']) * 100 : 0;

    const careerStats = {
      number: playerNumber,
      name: seasonStats[0]?.name || '',
      ...total,
      innings: totalInnings.toFixed(1),
      era: era.toFixed(2),
      whip: whip.toFixed(3),
      winrate: winrate.toFixed(3),
      opponent_avg: opponent_avg.toFixed(3),
      strikeout_rate: strikeout_rate.toFixed(1),
    };

    console.log('Pitcher career stats calculated:', careerStats);
    return { seasonStats, careerStats };
  } catch (error) {
    console.error('Pitcher fetch error:', error);
    return null;
  }
}

export function PlayerDetailContent({ player }: { player: Player }) {
  const [activeTab, setActiveTab] = useState<'batter' | 'pitcher'>('batter');
  const [batterStats, setBatterStats] =
    useState<BatterCareerApiResponse | null>(null);
  const [pitcherStats, setPitcherStats] =
    useState<PitcherCareerApiResponse | null>(null);
  const [isLoadingBatter, setIsLoadingBatter] = useState(false);
  const [isLoadingPitcher, setIsLoadingPitcher] = useState(false);

  // 탭 변경 시 해당 데이터 로드
  const handleTabChange = async (tab: 'batter' | 'pitcher') => {
    setActiveTab(tab);

    if (tab === 'batter' && !batterStats) {
      setIsLoadingBatter(true);
      const stats = await fetchBatterCareerStats(player.number);
      setBatterStats(stats);
      setIsLoadingBatter(false);
    } else if (tab === 'pitcher' && !pitcherStats) {
      setIsLoadingPitcher(true);
      const stats = await fetchPitcherCareerStats(player.number);
      setPitcherStats(stats);
      setIsLoadingPitcher(false);
    }
  };

  // 초기 타자 데이터 로드
  useEffect(() => {
    handleTabChange('batter');
  }, []);

  return (
    <main className="min-h-screen bg-black text-white py-8 md:py-16 px-4 sm:px-8 md:px-16 lg:px-32">
      {/* Responsive Player Header: full width, flex on large screens */}
      <section className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 mb-12">
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
          <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-red-500 shadow-lg">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover"
              sizes="160px"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center md:items-start flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display flex items-center gap-4 justify-center md:justify-start">
            <span className="text-red-500">#{player.number}</span>
            <span>{player.name}</span>
          </h1>
          <div className="text-lg md:text-xl text-gray-400 mb-2">
            {player.position}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="w-full mb-8">
        <div className="flex justify-center">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('batter')}
              className={`px-6 py-3 rounded-md transition-all duration-200 font-semibold ${
                activeTab === 'batter'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              타자 기록
            </button>
            <button
              onClick={() => handleTabChange('pitcher')}
              className={`px-6 py-3 rounded-md transition-all duration-200 font-semibold ${
                activeTab === 'pitcher'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              투수 기록
            </button>
          </div>
        </div>
      </section>

      <div className="w-full space-y-8">
        {/* Batter Stats */}
        {activeTab === 'batter' && (
          <>
            {isLoadingBatter ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-400">타자 기록을 불러오는 중...</div>
              </div>
            ) : (
              <>
                {/* Detailed Yearly Stats Table */}
                <section className="w-full bg-black/60 border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
                    연도별 기록
                  </h2>
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
                        {batterStats && batterStats.seasonStats.length > 0 ? (
                          batterStats.seasonStats.map((stat) => {
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
                          })
                        ) : (
                          <tr>
                            <td colSpan={19} className="py-8 text-gray-400">
                              연도별 기록이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Career Stats Detailed Table */}
                {batterStats && batterStats.careerStats && (
                  <section className="w-full bg-black/60 border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
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
            {isLoadingPitcher ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-400">투수 기록을 불러오는 중...</div>
              </div>
            ) : (
              <>
                {/* Detailed Yearly Pitcher Stats Table */}
                <section className="w-full bg-black/60 border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
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
                  <section className="w-full bg-black/60 border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
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

        {!batterStats && !pitcherStats && (
          <p className="mt-8 text-gray-400 text-center">
            기록 데이터를 불러오는 데 실패했습니다.
          </p>
        )}
      </div>
    </main>
  );
}
