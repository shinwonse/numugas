import EmptyState from './empty-state';
import PlayerCard, { Player } from './player-card';

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return <EmptyState message="해당 포지션의 선수가 없습니다." />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} index={index} />
      ))}
    </div>
  );
}
