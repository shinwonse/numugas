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
      {/* Position Tabs */}
      <div className="flex justify-center mb-12 md:mb-16">
        <PlayerPositionTabs
          positions={positions}
          selectedPosition={selectedPosition}
          onSelect={setSelectedPosition}
        />
      </div>

      {/* Stats Info */}
      <motion.div
        key={selectedPosition}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <p className="text-gray-400">
          {filteredPlayers.length}명의 선수
        </p>
      </motion.div>

      {/* Player List */}
      <PlayerList players={filteredPlayers} />
    </div>
  );
}
