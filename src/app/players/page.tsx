import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next/types';
import { unstable_cache } from 'next/cache';
import PlayerPositionSection from './components/player-position-section';

export const metadata: Metadata = {
  title: '선수 명단',
  description:
    '담장NUMUGAS 야구팀 선수 명단입니다. 투수, 포수, 내야수, 외야수 포지션별 선수 정보를 확인하세요.',
};

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
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Apple-style mesh gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      {/* Subtle noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-24 pb-16 md:pt-28 md:pb-20">
        {error ? (
          <div className="text-center text-red-400 py-12 text-sm">{error}</div>
        ) : (
          <PlayerPositionSection positions={positions} players={players} />
        )}
      </div>
    </main>
  );
}
