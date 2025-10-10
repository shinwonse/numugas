'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Player } from './player-card';
import PlayerList from './player-list';
import PlayerPositionTabs from './player-position-tabs';

interface PlayerPositionSectionProps {
  positions: string[];
  players: Player[];
}

export default function PlayerPositionSection({
  positions,
  players,
}: PlayerPositionSectionProps) {
  const [selectedPosition, setSelectedPosition] = useState(positions[0]);
  const filteredPlayers =
    selectedPosition === '전체'
      ? players
      : players.filter((p) => p.position === selectedPosition);

  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-16 md:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-display text-white tracking-tight">
          선수단 <span className="text-red-500">로스터</span>
        </h1>

        {/* Position Tabs */}
        <div className="flex justify-center">
          <PlayerPositionTabs
            positions={positions}
            selectedPosition={selectedPosition}
            onSelect={setSelectedPosition}
          />
        </div>
      </div>

      {/* Player List */}
      <motion.div
        key={selectedPosition}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PlayerList players={filteredPlayers} />
      </motion.div>
    </div>
  );
}
