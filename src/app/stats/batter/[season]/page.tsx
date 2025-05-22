import { notFound } from 'next/navigation';
import BatterStatsTable from './BatterStatsTable';

const SEASONS = ['통산', '2025', '2024', '2023', '2022', '2021', '2020'];

export async function generateStaticParams() {
  return SEASONS.map((season) => ({ season }));
}

export default async function BatterStatsPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const decodedSeason = decodeURIComponent(season);
  console.log(SEASONS.includes(decodedSeason));
  // '통산'도 허용

  if (!SEASONS.includes(decodedSeason)) notFound();

  // 데이터는 클라이언트 컴포넌트에서 useBattingStatsBySeason로 가져오도록 함
  return <BatterStatsTable season={decodedSeason} />;
}
