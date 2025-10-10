'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ShimmerCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ShimmerCard({
  children,
  className = '',
  delay = 0,
}: ShimmerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: 'backOut',
      }}
      viewport={{ once: false, amount: 0.2 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-red-500/10 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      {children}
    </motion.div>
  );
}
