'use client';

import BatterStatsTable from '@/app/stats/(batter)/batter-stats-table';
import PitcherStatsTable from '@/app/stats/(pitcher)/pitcher-stats-table';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
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
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s 0.2s, transform 0.7s 0.2s',
      }}
    >
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
    </div>
  );
}
