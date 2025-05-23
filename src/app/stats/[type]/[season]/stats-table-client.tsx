'use client';

import dynamic from 'next/dynamic';

const BatterStatsTable = dynamic(
  () => import('@/app/stats/(batter)/batter-stats-table'),
  { ssr: false },
);
const PitcherStatsTable = dynamic(
  () => import('@/app/stats/(pitcher)/pitcher-stats-table'),
  { ssr: false },
);

export default function StatsTableClient({
  type,
  season,
}: {
  type: string;
  season: string;
}) {
  if (type === 'batter') {
    return <BatterStatsTable season={season} />;
  }
  return <PitcherStatsTable season={season} />;
}
