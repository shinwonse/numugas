import { PlayerCard3D } from '@/components/animated/player-card-3d';
import { ImageUtils } from '@/lib/supabase-image';

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

interface PlayerCardProps {
  player: Player;
  index?: number;
}

export default function PlayerCard({ player, index = 0 }: PlayerCardProps) {
  // 사진 URL 처리 - 빈 문자열이나 null/undefined 체크
  const photoUrl =
    player.photo && player.photo.trim() !== ''
      ? ImageUtils.getCardSize(player.photo)
      : '/logo.webp';

  return (
    <PlayerCard3D
      player={{
        ...player,
        photo: photoUrl,
      }}
      index={index}
    />
  );
}
