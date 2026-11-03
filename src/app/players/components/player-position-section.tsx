'use client';

import { PageHeader } from '@/components/page-header';
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
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <PageHeader
          eyebrow={`${String(players.length)}명`}
          title="선수단"
          className="mb-0"
        />
        <PlayerPositionTabs
          positions={positions}
          selectedPosition={selectedPosition}
          onSelect={setSelectedPosition}
          className="md:mx-0"
        />
      </div>

      {/* Player List */}
      <div
        key={selectedPosition}
        style={{ animation: 'fade-in-up 0.3s ease both' }}
      >
        <PlayerList players={filteredPlayers} />
      </div>
    </div>
  );
}
