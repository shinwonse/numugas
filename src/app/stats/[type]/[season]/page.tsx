import { SectionBackground } from '@/components/animated/section-background';
import { notFound } from 'next/navigation';
import { StatsPageHeader } from './stats-page-header';
import StatsTableClient from './stats-table-client';

const SEASONS = ['통산', '2025', '2024', '2023', '2022', '2021', '2020'];
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
    <main className="relative flex flex-col py-12 md:py-16 min-h-screen overflow-hidden">
      <SectionBackground variant="dots" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <StatsPageHeader tabList={tabList} currentType={type} />
        <StatsTableClient type={type} season={season} />
      </div>
    </main>
  );
}
