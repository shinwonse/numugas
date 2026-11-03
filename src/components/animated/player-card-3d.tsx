import { cn } from '@/lib/cn';
import Image from 'next/image';
import Link from 'next/link';

interface PlayerCard3DProps {
  player: {
    id: number;
    name: string;
    position: string;
    number: number;
    photo: string;
  };
  index: number;
}

/**
 * 유니폼 등판 느낌의 선수 카드.
 * 사진 위에 외곽선만 있는 큰 등번호를 깔고, 호버하면 번호가 붉게 차오르고 하단 선이 그어진다.
 */
export function PlayerCard3D({ player, index }: PlayerCard3DProps) {
  const hasPhoto = player.photo.trim() !== '' && player.photo !== '/logo.webp';

  return (
    // JS 없이 CSS로만 나타나게 해서, 첫 화면 사진이 하이드레이션을 기다리지 않는다
    <div
      className="animate-[fade-in-up_0.5s_ease_both] motion-reduce:animate-none"
      style={{ animationDelay: `${String(Math.min(index, 12) * 40)}ms` }}
    >
      <Link
        href={`/players/${String(player.number)}`}
        className="group block cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <div
          className={cn(
            'relative aspect-[3/4] overflow-hidden rounded-lg',
            'border border-white/[0.06] bg-[#0c0c12]',
            'transition-[border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-red-500/40',
          )}
        >
          <Image
            src={hasPhoto ? player.photo : '/logo.webp'}
            alt={player.name}
            fill
            className={cn(
              'transition-transform duration-700 ease-out group-hover:scale-105',
              hasPhoto ? 'object-cover object-top' : 'object-contain p-10 opacity-30',
            )}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            priority={index < 4}
          />

          {/* 사진 아래쪽을 어둡게 눌러 이름과 번호가 읽히게 한다 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-700/0 to-red-700/0 transition-colors duration-500 group-hover:to-red-700/25" />

          {/* 등번호: 평소엔 외곽선, 호버하면 붉게 채워진다 */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-3 bottom-10 text-6xl font-black leading-none sm:text-7xl',
              'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]',
              'transition-[color,-webkit-text-stroke-color,transform] duration-500',
              'group-hover:-translate-y-1 group-hover:text-red-500/90 group-hover:[-webkit-text-stroke-color:rgb(239,68,68)]',
            )}
          >
            {player.number}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400 sm:text-[11px]">
              {player.position}
            </p>
            <h3 className="mt-0.5 truncate text-base font-bold text-white sm:text-lg">
              {player.name}
            </h3>
          </div>

          {/* 하단 붉은 선: 호버하면 왼쪽부터 그어진다 */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-red-500 transition-transform duration-500 group-hover:scale-x-100"
          />
        </div>
      </Link>
    </div>
  );
}
