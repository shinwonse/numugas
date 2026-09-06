import { SectionBackground } from '@/components/animated/section-background';
import {
  fetchBatterCareerByNumber,
  fetchPitcherCareerByNumber,
} from '@/lib/fetchers/player-career';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next/types';
import { unstable_cache } from 'next/cache';
import { PlayerDetailContent } from './player-detail-content';

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await supabase.from('players').select('number');
  return (data ?? []).map((p) => ({ number: String(p.number) }));
}

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

    // PGRST116 = 결과 없음. 그 외 에러는 캐시하지 않도록 throw.
    if (error && error.code !== 'PGRST116') {
      throw new Error(`player #${number}: ${error.message}`);
    }
    return { data, error };
  },
  ['player-data'], // 캐시 키
  {
    revalidate: 300, // 5분마다 재검증
    tags: ['players'], // 태그로 무효화 가능
  },
);

const EMPTY_CAREER = { seasonStats: [], careerStats: null };

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { number } = await params;

  // 선수 메타데이터 + 타자/투수 기록을 모두 서버에서 fetch
  // 기록 조회 실패는 캐시되지 않게 fetcher가 throw한다. 여기서 빈 기록으로 흡수.
  const [{ data, error }, batterCareer, pitcherCareer] = await Promise.all([
    getCachedPlayerData(number).catch((e: unknown) => {
      console.error(`[players] 선수 조회 실패 #${number}`, e);
      return { data: null, error: e as { message: string } };
    }),
    fetchBatterCareerByNumber(number).catch((e: unknown) => {
      console.error(`[players] 타자 기록 조회 실패 #${number}`, e);
      return EMPTY_CAREER;
    }),
    fetchPitcherCareerByNumber(number).catch((e: unknown) => {
      console.error(`[players] 투수 기록 조회 실패 #${number}`, e);
      return EMPTY_CAREER;
    }),
  ]);

  if (error || !data) {
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

  return (
    <PlayerDetailContent
      player={player}
      batterCareer={batterCareer}
      pitcherCareer={pitcherCareer}
    />
  );
}
