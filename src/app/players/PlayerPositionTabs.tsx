'use client';

import StatsTabs from '@/components/stats-tabs';
import Image from 'next/image';
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

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
          <div className="col-span-full text-center text-gray-400 py-12">
            해당 포지션의 선수가 없습니다.
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between min-h-[340px]"
            >
              <div className="w-full aspect-square relative">
                <Image
                  src={player.photo ?? '/logo.png'}
                  alt={player.name}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
                />
              </div>
              <div className="flex items-center justify-between px-6 py-5 bg-white">
                <span className="text-lg font-semibold text-black">
                  {player.name}
                </span>
                <span className="text-3xl font-extrabold text-gray-800">
                  {player.number}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
