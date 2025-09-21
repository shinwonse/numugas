'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 -mt-16"
      >
        <div className="flex items-center justify-center">
          <Image
            src="title.png"
            alt="title"
            width={500}
            height={100}
            className="object-contain"
          />
        </div>
      </motion.div>
    </section>
  );
}
