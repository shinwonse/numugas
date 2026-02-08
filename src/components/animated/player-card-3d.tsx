'use client';

import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
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

export function PlayerCard3D({ player, index }: PlayerCard3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/players/${player.number}`} className="block cursor-pointer">
        <div className="relative group transition-transform duration-300 ease-out hover:-translate-y-1.5">
          <div
            className={cn(
              'relative rounded-2xl overflow-hidden',
              'bg-[#0c0c12]',
              'border border-white/[0.06]',
              'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
            )}
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src={
                  player.photo && player.photo.trim() !== ''
                    ? player.photo
                    : '/logo.webp'
                }
                alt={player.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Bottom gradient fade - 카드 레벨에서 이미지/정보 경계를 덮음 */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/60 to-transparent pointer-events-none" />

            {/* Info Section */}
            <div className="relative z-10 px-5 pb-5 -mt-14">
              {/* Position Badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 mb-3',
                  'text-[11px] font-semibold uppercase tracking-wider',
                  'rounded-full',
                  'bg-white/[0.08]',
                  'border border-white/[0.08]',
                  'text-red-400',
                )}
              >
                {player.position}
              </span>

              {/* Player Info */}
              <div className="flex items-end justify-between">
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                  {player.name}
                </h3>
                <span className="text-3xl md:text-4xl font-black text-white/[0.08] group-hover:text-red-500/20 transition-colors duration-300 leading-none font-display">
                  {player.number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
