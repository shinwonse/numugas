import { supabase } from '@/lib/supabase';
import { PlayerDetailContent } from './player-detail-content';

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

  return <PlayerDetailContent player={player} />;
}
