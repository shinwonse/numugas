'use client';

import BatterStatsTable from '@/app/stats/(batter)/batter-stats-table';
import PitcherStatsTable from '@/app/stats/(pitcher)/pitcher-stats-table';
import { SwitchCase } from 'react-simplikit';

interface StatsTableClientProps {
  type: string;
  season: string;
  initialData: any[];
}

export default function StatsTableClient({
  type,
  season,
  initialData,
}: StatsTableClientProps) {
  return (
    <SwitchCase
      value={type}
      caseBy={{
        batter: () => (
          <BatterStatsTable season={season} initialData={initialData} />
        ),
        pitcher: () => (
          <PitcherStatsTable season={season} initialData={initialData} />
        ),
      }}
    />
  );
}
