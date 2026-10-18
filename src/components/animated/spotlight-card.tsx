'use client';

import { ReactNode, useRef } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/** 마우스 위치에 따라 살짝 기울어지는 카드 (최대 ±5도) */
export function SpotlightCard({
  children,
  className = '',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 리렌더 없이 스타일만 바꾼다
  const tilt = (rotateX: number, rotateY: number) => {
    ref.current?.style.setProperty(
      'transform',
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    tilt(-y * 5, x * 5);
  };

  const handleMouseLeave = () => {
    tilt(0, 0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative transition-transform duration-300 ease-out motion-reduce:transition-none ${className}`}
    >
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ transform: 'translateZ(-50px)' }}
      />
      {children}
    </div>
  );
}
