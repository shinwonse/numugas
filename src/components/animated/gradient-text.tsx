'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <motion.span
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`bg-gradient-to-r from-red-500 via-white to-red-500 bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.span>
  );
}
