'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
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
          batter: () => <BatterStatsTable season={season} />,
          pitcher: () => <PitcherStatsTable season={season} />,
        }}
      />
    </div>
  );
}
