'use client';

import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  isInView: boolean;
}

export function SectionTitle({
  subtitle,
  title,
  description,
  isInView,
}: SectionTitleProps) {
  return (
    <div className="text-center mb-16 md:mb-20">
      {/* Subtitle Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex"
      >
        <span
          className={cn(
            'px-4 py-1.5 rounded-full',
            'text-xs font-semibold uppercase tracking-[0.2em]',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'text-gray-400',
          )}
        >
          {subtitle}
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl',
          'font-bold tracking-tight',
          'text-white',
        )}
      >
        {title}
      </motion.h2>

      {/* Gradient Underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 mx-auto h-0.5 w-16 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-full"
      />

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
