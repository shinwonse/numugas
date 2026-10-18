'use client';

import BatterStatsTable from '@/app/stats/(batter)/batter-stats-table';
import PitcherStatsTable from '@/app/stats/(pitcher)/pitcher-stats-table';
import type { League } from '@/lib/leagues';
import { SwitchCase } from 'react-simplikit';

interface StatsTableClientProps {
  type: string;
  season: string;
  league: League | undefined;
  initialData: any[];
}

export default function StatsTableClient({
  type,
  season,
  league,
  initialData,
}: StatsTableClientProps) {
  return (
    <SwitchCase
      value={type}
      caseBy={{
        batter: () => (
          <BatterStatsTable season={season} league={league} initialData={initialData} />
        ),
        pitcher: () => (
          <PitcherStatsTable season={season} league={league} initialData={initialData} />
        ),
      }}
    />
  );
}
