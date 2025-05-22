import { notFound } from 'next/navigation';
import PitcherStatsTable from './components/pitcher-stats-table';

const SEASONS = ['통산', '2025', '2024', '2023', '2022', '2021', '2020'];

export async function generateStaticParams() {
  return SEASONS.map((season) => ({ season }));
}

export default async function PitcherStatsPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const decodedSeason = decodeURIComponent(season);
  if (!SEASONS.includes(decodedSeason)) notFound();
  return <PitcherStatsTable season={decodedSeason} />;
}
