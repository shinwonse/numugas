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
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-red-500">
            TEAM ROSTER
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display text-white tracking-tight"
        >
          선수단 <span className="text-red-500">로스터</span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8"
        />

        {/* Position Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <PlayerPositionTabs
            positions={positions}
            selectedPosition={selectedPosition}
            onSelect={setSelectedPosition}
          />
        </motion.div>
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
