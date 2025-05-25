import { supabase } from '@/lib/supabase';
import PlayerPositionSection from './components/player-position-section';

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

  const positions = ['전체', '투수', '포수', '내/외야수'];

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);
  const mappedPlayers = sortedPlayers.map((p) => ({
    ...p,
    photo: p.photo_url,
    stats: {},
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
          <PlayerPositionSection
            positions={positions}
            players={mappedPlayers}
          />
        )}
      </div>
    </main>
  );
}
