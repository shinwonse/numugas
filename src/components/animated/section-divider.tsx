'use client';

import { motion } from 'framer-motion';

export function SectionDivider() {
  return (
    <div className="relative py-12 md:py-16 overflow-hidden">
      {/* Gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
      />

      {/* Center dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
      />
    </div>
  );
}
