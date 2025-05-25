'use client';

import StatsTabs from '@/components/stats-tabs';
import { useState } from 'react';
import EmptyState from './empty-state';
import PlayerCard, { Player } from './player-card';

interface PlayerPositionTabsProps {
  positions: string[];
  players: Player[];
}

export default function PlayerPositionTabs({
  positions,
  players,
}: PlayerPositionTabsProps) {
  const [selectedPosition, setSelectedPosition] = useState(positions[0]);
  const filteredPlayers =
    selectedPosition === '전체'
      ? players
      : players.filter((p) => p.position === selectedPosition);

  const tabList = positions.map((pos) => ({
    key: pos,
    label: pos,
  }));

  return (
    <>
      <StatsTabs
        tabs={tabList}
        current={selectedPosition}
        className="mb-10"
        onTabClick={setSelectedPosition}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
        {filteredPlayers.length === 0 ? (
          <EmptyState message="해당 포지션의 선수가 없습니다." />
        ) : (
          filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))
        )}
      </div>
    </>
  );
}
