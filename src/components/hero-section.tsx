'use client';

import { FloatingParticles } from '@/components/animated/floating-particles';
import { GridBackground } from '@/components/animated/grid-background';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-6">
      {/* Animated Grid Background */}
      <GridBackground />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-12 max-w-5xl mx-auto text-center -mt-20 relative z-10"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Image
              src="/title.png"
              alt="담장NUMUGAS"
              width={600}
              height={120}
              className="object-contain w-full max-w-2xl drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]"
              priority
              fetchPriority="high"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
