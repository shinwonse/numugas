'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        href={`/players/${player.number}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 group-hover:border-red-500/50 transition-colors duration-500">
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src={player.photo ?? '/placeholder-user.jpg'}
                alt={player.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info Section */}
            <div className="relative p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
              {/* Position Badge */}
              <div className="absolute top-4 left-6">
                <span className="px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full border border-red-500/30 backdrop-blur-sm">
                  {player.position}
                </span>
              </div>

              {/* Player Info */}
              <div className="flex items-center justify-between mt-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                    {player.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl md:text-5xl font-black text-white/20 group-hover:text-red-500/30 transition-colors duration-300">
                    {player.number}
                  </div>
                </div>
              </div>

              {/* Hover Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 right-6"
              >
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Shadow */}
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
