import Image from 'next/image';

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
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between min-h-[340px]">
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
        <span className="text-lg font-semibold text-black">{player.name}</span>
        <span className="text-3xl font-extrabold text-gray-800">
          {player.number}
        </span>
      </div>
    </div>
  );
}
