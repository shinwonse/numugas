'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PARTICLE_COUNT = 50;

interface Particle {
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  xMovement: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on client side
    const generatedParticles = Array.from({ length: PARTICLE_COUNT }, () => ({
      size: Math.random() * 4 + 2,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
      xMovement: Math.random() * 20 - 10,
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-red-500/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xMovement, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
