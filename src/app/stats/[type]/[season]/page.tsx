import { notFound } from 'next/navigation';
import { StatsPageHeader } from './stats-page-header';
import StatsTableClient from './stats-table-client';

const SEASONS = ['통산', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

export async function generateStaticParams() {
  return TYPES.flatMap((type) =>
    SEASONS.map((season) => ({ type: type.key, season })),
  );
}

export default async function StatsTypeSeasonPage({
  params,
}: {
  params: { type: string; season: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const type = decodeURIComponent(resolvedParams.type);
  const season = decodeURIComponent(resolvedParams.season);
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  const tabList = TYPES.map((t) => ({
    key: t.key,
    label: t.label,
    href: `/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`,
  }));

  return (
    <main className="flex flex-col pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <StatsPageHeader tabList={tabList} currentType={type} />
        <StatsTableClient type={type} season={season} />
      </div>
    </main>
  );
}
