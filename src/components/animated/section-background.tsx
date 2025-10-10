'use client';

import { motion } from 'framer-motion';

interface SectionBackgroundProps {
  variant?: 'dots' | 'lines' | 'gradient' | 'none';
}

export function SectionBackground({
  variant = 'dots',
}: SectionBackgroundProps) {
  if (variant === 'none') return null;

  if (variant === 'gradient') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-transparent"
        />
      </div>
    );
  }

  if (variant === 'lines') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="lines"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 20 L 100 20 M 0 50 L 100 50 M 0 80 L 100 80"
                stroke="currentColor"
                strokeWidth="1"
                className="text-red-500/50"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>
    );
  }

  // dots variant (default)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              fill="currentColor"
              className="text-red-500"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}
