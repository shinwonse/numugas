import { ImageUtils } from '@/lib/supabase-image';
import Image from 'next/image';
import Link from 'next/link';

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
    <Link
      href={`/players/${player.number}`}
      prefetch={true}
      className="block group focus:outline-none focus:ring-2 focus:ring-red-500 rounded-2xl"
    >
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between min-h-[240px] sm:min-h-[300px] md:min-h-[340px] group-hover:shadow-lg transition-all duration-200">
        <div className="w-full aspect-square relative">
          <Image
            src={ImageUtils.getCardSize(player.photo ?? '/logo.webp')}
            alt={player.name}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, 33vw"
            placeholder="blur"
            blurDataURL={ImageUtils.getTinyBlur(player.photo ?? '/logo.webp')}
            priority={false}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-5 bg-white">
          <span className="text-sm sm:text-base md:text-lg font-semibold text-black group-hover:text-red-600 transition-colors">
            {player.name}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800">
            {player.number}
          </span>
        </div>
      </div>
    </Link>
  );
}
