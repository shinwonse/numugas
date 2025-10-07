'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-12 max-w-5xl mx-auto text-center -mt-20"
      >
        <div className="flex flex-col items-center gap-8">
          <Image
            src="title.png"
            alt="담장NUMUGAS"
            width={600}
            height={120}
            className="object-contain w-full max-w-2xl"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
