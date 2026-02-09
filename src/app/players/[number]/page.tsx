import { SectionBackground } from '@/components/animated/section-background';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next/types';
import { unstable_cache } from 'next/cache';
import { PlayerDetailContent } from './player-detail-content';

interface PlayerDetailPageProps {
  params: { number: string };
}

export async function generateMetadata({
  params,
}: PlayerDetailPageProps): Promise<Metadata> {
  const { number } = await params;
  const { data } = await supabase
    .from('players')
    .select('name, position, number')
    .eq('number', number)
    .single();

  if (!data) {
    return { title: '선수 정보' };
  }

  return {
    title: `${data.name} (No.${data.number}) - ${data.position}`,
    description: `담장NUMUGAS ${data.position} ${data.name} 선수의 상세 정보와 기록을 확인하세요.`,
  };
}

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

// 선수 데이터 캐싱 함수
const getCachedPlayerData = unstable_cache(
  async (number: string) => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name, number, position, photo_url')
      .eq('number', number)
      .single();

    return { data, error };
  },
  ['player-data'], // 캐시 키
  {
    revalidate: 300, // 5분마다 재검증
    tags: ['players'], // 태그로 무효화 가능
  },
);

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { number } = await params;

  // 캐시된 데이터 가져오기
  const { data, error } = await getCachedPlayerData(number);

  if (error || !data) {
    // Show not found or error state
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
        <SectionBackground variant="gradient" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">
            선수 정보를 찾을 수 없습니다
          </h1>
          <p className="text-gray-400">
            존재하지 않는 선수이거나, 정보를 불러오는 데 실패했습니다.
          </p>
        </div>
      </main>
    );
  }

  const player: Player = {
    id: data.id,
    name: data.name,
    position: data.position,
    number: data.number,
    photo: data.photo_url ?? '/logo.webp',
    stats: {},
  };

  return <PlayerDetailContent player={player} />;
}
