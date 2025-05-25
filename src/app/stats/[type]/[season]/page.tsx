import StatsTabs from '@/components/StatsTabs';
import { notFound } from 'next/navigation';
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
  const type = decodeURIComponent(params.type);
  const season = decodeURIComponent(params.season);
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  const tabList = TYPES.map((t) => ({
    key: t.key,
    label: t.label,
    href: `/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`,
  }));

  return (
    <main className="flex flex-col gap-0 bg-black min-h-screen">
      <div className="w-full flex justify-center">
        <StatsTabs tabs={tabList} current={type} />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <StatsTableClient type={type} season={season} />
      </div>
    </main>
  );
}
