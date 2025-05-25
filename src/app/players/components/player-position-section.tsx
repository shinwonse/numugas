'use client';

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
    <>
      <PlayerPositionTabs
        positions={positions}
        selectedPosition={selectedPosition}
        onSelect={setSelectedPosition}
        className="mb-10"
      />
      <PlayerList players={filteredPlayers} />
    </>
  );
}
