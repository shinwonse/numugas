import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next/types';
import { unstable_cache } from 'next/cache';
import type { Player } from './components/player-card';
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

    // 실패를 캐시하지 않도록 던진다 (unstable_cache는 throw한 결과를 저장하지 않음)
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ['players-list'], // 캐시 키
  {
    revalidate: false, // on-demand revalidation only
    tags: ['players'],
  },
);

export default async function PlayersPage() {
  let players: Player[] = [];
  let error: string | null = null;

  try {
    // 이미 DB에서 정렬되어 있으므로 추가 정렬 불필요
    players = (await getCachedPlayersData()).map((p) => ({
      ...p,
      photo: p.photo_url,
      stats: {},
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : '선수 명단을 불러오지 못했습니다.';
  }

  const positions = ['전체', '투수', '포수', '내/외야수'];

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <MeshGradientBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pb-20">
        {error ? (
          <div className="text-center text-red-400 py-12 text-sm">{error}</div>
        ) : (
          <PlayerPositionSection positions={positions} players={players} />
        )}
      </div>
    </main>
  );
}
