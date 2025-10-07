'use client';

import dynamic from 'next/dynamic';
import { SwitchCase } from 'react-simplikit';

const BatterStatsTable = dynamic(
  () => import('@/app/stats/(batter)/batter-stats-table'),
  { ssr: false },
);

const PitcherStatsTable = dynamic(
  () => import('@/app/stats/(pitcher)/pitcher-stats-table'),
  { ssr: false },
);

interface StatsTableClientProps {
  type: string;
  season: string;
}

export default function StatsTableClient({
  type,
  season,
}: StatsTableClientProps) {
  return (
    <SwitchCase
      value={type}
      caseBy={{
        batter: () => <BatterStatsTable season={season} />,
        pitcher: () => <PitcherStatsTable season={season} />,
      }}
    />
  );
}
