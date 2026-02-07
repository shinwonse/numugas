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
      <div className="text-center mb-10 md:mb-14">
        {/* Glass badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-5 inline-flex"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Team Roster
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 font-display tracking-tight"
        >
          <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
            선수단{' '}
          </span>
          <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
            로스터
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-sm md:text-base text-gray-500 mb-8"
        >
          포지션별 선수 정보를 확인하세요
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-red-500/60 to-transparent mb-8"
        />

        {/* Position Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
