import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface PlayerDetailPageProps {
  params: { id: string };
}

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

// Mocked yearly stats for demonstration
const MOCK_YEARLY_STATS = [
  {
    year: 2023,
    games: 20,
    avg: 0.312,
    hr: 5,
    rbi: 22,
    sb: 7,
  },
  {
    year: 2024,
    games: 18,
    avg: 0.298,
    hr: 3,
    rbi: 18,
    sb: 5,
  },
];

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { id } = params;
  // Fetch player data from supabase
  const { data, error } = await supabase
    .from('players')
    .select('id, name, number, position, photo_url')
    .eq('id', id)
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
      {/* Main content container for stats */}
      <div className="w-full">
        {/* Yearly Stats Table */}
        <section className="w-full bg-black/60 border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
            연도별 기록
          </h2>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-gray-700 text-gray-300">
                  <th className="py-2 px-4">연도</th>
                  <th className="py-2 px-4">경기</th>
                  <th className="py-2 px-4">타율</th>
                  <th className="py-2 px-4">홈런</th>
                  <th className="py-2 px-4">타점</th>
                  <th className="py-2 px-4">도루</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_YEARLY_STATS.map((stat) => (
                  <tr
                    key={stat.year}
                    className="border-b border-gray-800 hover:bg-red-950/20 transition-colors"
                  >
                    <td className="py-2 px-4 font-bold text-red-400">
                      {stat.year}
                    </td>
                    <td className="py-2 px-4">{stat.games}</td>
                    <td className="py-2 px-4">{stat.avg.toFixed(3)}</td>
                    <td className="py-2 px-4">{stat.hr}</td>
                    <td className="py-2 px-4">{stat.rbi}</td>
                    <td className="py-2 px-4">{stat.sb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="mt-8 text-gray-400 text-center">
          (이 페이지는 임시입니다. 실제 기록 데이터 연동 예정)
        </p>
      </div>
    </main>
  );
}
