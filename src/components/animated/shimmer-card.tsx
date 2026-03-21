'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
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
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden group ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView
          ? 'translateY(0) scale(1)'
          : 'translateY(40px) scale(0.95)',
        transition: `opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
      }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      {children}
    </div>
  );
}
