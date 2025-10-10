'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <SwitchCase
        value={type}
        caseBy={{
          batter: () => <BatterStatsTable season={season} />,
          pitcher: () => <PitcherStatsTable season={season} />,
        }}
      />
    </motion.div>
  );
}
