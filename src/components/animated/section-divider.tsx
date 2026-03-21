'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function SectionDivider() {
  const { ref, isInView } = useIntersectionObserver();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative py-12 md:py-16 overflow-hidden"
    >
      {/* Gradient line */}
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.5s ease-in-out',
        }}
      />

      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0)',
          transition: 'opacity 0.5s 0.5s, transform 0.5s 0.5s',
        }}
      />
    </div>
  );
}
