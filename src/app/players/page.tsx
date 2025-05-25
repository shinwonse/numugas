import { supabase } from '@/lib/supabase';
import PlayerPositionTabs from './PlayerPositionTabs';

export default async function PlayersPage() {
  let players: any[] = [];
  let error = null;
  try {
    const { data, error: dbError } = await supabase
      .from('players')
      .select('id, name, number, position, photo_url');
    if (dbError) throw new Error(dbError.message);
    players = data ?? [];
  } catch (e: any) {
    error = e.message;
  }

  // 포지션 목록 동적 생성 ("전체" + 중복 제거)
  const positions = [
    '전체',
    ...Array.from(new Set(players.map((p) => p.position))),
  ];

  // PlayerPositionTabs에 맞게 photo 필드 매핑
  const mappedPlayers = players.map((p) => ({
    ...p,
    photo: p.photo_url,
    stats: {}, // stats는 API에 없으므로 빈 객체 전달
  }));

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center font-display">
          <span className="text-red-600">선수단</span> 명단
        </h1>
        {error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <PlayerPositionTabs positions={positions} players={mappedPlayers} />
        )}
      </div>
    </main>
  );
}
