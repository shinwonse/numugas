import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface PlayerDetailPageProps {
  params: { number: string };
}

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

interface BatterCareerApiResponse {
  seasonStats: any[];
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

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { number } = await params;
  // Fetch player data from supabase
  const { data, error } = await supabase
    .from('players')
    .select('id, name, number, position, photo_url')
    .eq('number', number)
    .single();

  if (error || !data) {
    // Show not found or error state
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">
          선수 정보를 찾을 수 없습니다
        </h1>
        <p className="text-gray-400">
          존재하지 않는 선수이거나, 정보를 불러오는 데 실패했습니다.
        </p>
      </main>
    );
  }

  const player: Player = {
    id: data.id,
    name: data.name,
    position: data.position,
    number: data.number,
    photo: data.photo_url ?? '/logo.png',
    stats: {},
  };

  // Fetch batter career stats from the new API
  const batterStats = await fetchBatterCareerStats(player.number);

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
      <div className="w-full space-y-8">
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
                  <th className="py-3 px-2 text-sm font-semibold">경기</th>
                  <th className="py-3 px-2 text-sm font-semibold">타율</th>
                  <th className="py-3 px-2 text-sm font-semibold">출루율</th>
                  <th className="py-3 px-2 text-sm font-semibold">장타율</th>
                  <th className="py-3 px-2 text-sm font-semibold">타석</th>
                  <th className="py-3 px-2 text-sm font-semibold">타수</th>
                  <th className="py-3 px-2 text-sm font-semibold">안타</th>
                  <th className="py-3 px-2 text-sm font-semibold">1루타</th>
                  <th className="py-3 px-2 text-sm font-semibold">2루타</th>
                  <th className="py-3 px-2 text-sm font-semibold">3루타</th>
                  <th className="py-3 px-2 text-sm font-semibold">홈런</th>
                  <th className="py-3 px-2 text-sm font-semibold">득점</th>
                  <th className="py-3 px-2 text-sm font-semibold">타점</th>
                  <th className="py-3 px-2 text-sm font-semibold">루타</th>
                  <th className="py-3 px-2 text-sm font-semibold">도루</th>
                  <th className="py-3 px-2 text-sm font-semibold">도루실패</th>
                  <th className="py-3 px-2 text-sm font-semibold">볼넷</th>
                  <th className="py-3 px-2 text-sm font-semibold">삼진</th>
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
                        <td className="py-3 px-2 font-semibold">{avg}</td>
                        <td className="py-3 px-2 font-semibold">
                          {onbasePercentage}
                        </td>
                        <td className="py-3 px-2 font-semibold">
                          {sluggingPercentage}
                        </td>
                        <td className="py-3 px-2">
                          {stat.plateappearances || 0}
                        </td>
                        <td className="py-3 px-2">{stat.atbats || 0}</td>
                        <td className="py-3 px-2 font-semibold">
                          {stat.hits || 0}
                        </td>
                        <td className="py-3 px-2">{stat.singles || 0}</td>
                        <td className="py-3 px-2">{stat.doubles || 0}</td>
                        <td className="py-3 px-2">{stat.triples || 0}</td>
                        <td className="py-3 px-2 font-semibold">
                          {stat.homeruns || 0}
                        </td>
                        <td className="py-3 px-2">{stat.runs || 0}</td>
                        <td className="py-3 px-2 font-semibold">
                          {stat.rbi || 0}
                        </td>
                        <td className="py-3 px-2">{stat.totalbases || 0}</td>
                        <td className="py-3 px-2">{stat.stolenbases || 0}</td>
                        <td className="py-3 px-2">
                          {stat.caughtstealing || 0}
                        </td>
                        <td className="py-3 px-2">{stat.walks || 0}</td>
                        <td className="py-3 px-2">{stat.strikeouts || 0}</td>
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
                    <th className="py-3 px-3 text-sm font-semibold">경기</th>
                    <th className="py-3 px-3 text-sm font-semibold">타율</th>
                    <th className="py-3 px-3 text-sm font-semibold">출루율</th>
                    <th className="py-3 px-3 text-sm font-semibold">장타율</th>
                    <th className="py-3 px-3 text-sm font-semibold">타석</th>
                    <th className="py-3 px-3 text-sm font-semibold">타수</th>
                    <th className="py-3 px-3 text-sm font-semibold">안타</th>
                    <th className="py-3 px-3 text-sm font-semibold">홈런</th>
                    <th className="py-3 px-3 text-sm font-semibold">득점</th>
                    <th className="py-3 px-3 text-sm font-semibold">타점</th>
                    <th className="py-3 px-3 text-sm font-semibold">도루</th>
                    <th className="py-3 px-3 text-sm font-semibold">볼넷</th>
                    <th className="py-3 px-3 text-sm font-semibold">삼진</th>
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
        {!batterStats && (
          <p className="mt-8 text-gray-400 text-center">
            기록 데이터를 불러오는 데 실패했습니다.
          </p>
        )}
      </div>
    </main>
  );
}
