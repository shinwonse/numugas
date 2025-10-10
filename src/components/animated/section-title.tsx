'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionTitleProps {
  subtitle: string;
  title: ReactNode;
  description?: string;
  isInView: boolean;
  accentColor?: 'red' | 'blue' | 'gold';
}

export function SectionTitle({
  subtitle,
  title,
  description,
  isInView,
  accentColor = 'red',
}: SectionTitleProps) {
  const colors = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    gold: 'text-yellow-500',
  };

  const glowColors = {
    red: 'shadow-red-500/50',
    blue: 'shadow-blue-500/50',
    gold: 'shadow-yellow-500/50',
  };

  return (
    <div className="text-center mb-16 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <span
          className={`text-sm md:text-base font-bold uppercase tracking-[0.3em] ${colors[accentColor]}`}
        >
          {subtitle}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-4xl md:text-5xl lg:text-7xl font-bold mb-4 font-display text-white tracking-tight drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8 mx-auto h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent"
      />
    </div>
  );
}
