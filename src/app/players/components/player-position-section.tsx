'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
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
  const { ref, isInView } = useIntersectionObserver({ threshold: 0 });

  const filteredPlayers =
    selectedPosition === '전체'
      ? players
      : players.filter((p) => p.position === selectedPosition);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-14">
        {/* Glass badge */}
        <div
          className="mb-5 inline-flex"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition:
              'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Team Roster
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 font-display tracking-tight"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition:
              'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
          }}
        >
          <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
            선수단{' '}
          </span>
          <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
            로스터
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm md:text-base text-gray-500 mb-8"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition:
              'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
          }}
        >
          포지션별 선수 정보를 확인하세요
        </p>

        {/* Decorative line */}
        <div
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-red-500/60 to-transparent mb-8"
          style={{
            transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.8s 0.25s',
          }}
        />

        {/* Position Tabs */}
        <div
          className="flex justify-center"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition:
              'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
          }}
        >
          <PlayerPositionTabs
            positions={positions}
            selectedPosition={selectedPosition}
            onSelect={setSelectedPosition}
          />
        </div>
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
