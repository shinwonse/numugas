import { SectionBackground } from '@/components/animated/section-background';
import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import PlayerPositionSection from './components/player-position-section';

// 선수 목록 데이터 캐싱 함수
const getCachedPlayersData = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name, number, position, photo_url')
      .order('number', { ascending: true }); // DB 레벨에서 정렬

    return { data, error };
  },
  ['players-list'], // 캐시 키
  {
    revalidate: 300, // 5분마다 재검증
    tags: ['players'], // 태그로 무효화 가능
  },
);

export default async function PlayersPage() {
  let players: any[] = [];
  let error = null;

  try {
    const { data, error: dbError } = await getCachedPlayersData();
    if (dbError) throw new Error(dbError.message);

    // 이미 DB에서 정렬되어 있으므로 추가 정렬 불필요
    players =
      data?.map((p) => ({
        ...p,
        photo: p.photo_url,
        stats: {},
      })) ?? [];
  } catch (e: any) {
    error = e.message;
  }

  const positions = ['전체', '투수', '포수', '내/외야수'];

  return (
    <main className="relative min-h-screen bg-black text-white py-12 md:py-16 overflow-hidden">
      <SectionBackground variant="gradient" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <PlayerPositionSection positions={positions} players={players} />
        )}
      </div>
    </main>
  );
}
