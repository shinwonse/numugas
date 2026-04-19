'use client';

import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { BarChart3, Home, ListOrdered, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

const NAV_ITEMS = [
  { label: 'HOME', href: '/', icon: Home },
  { label: 'ABOUT', href: '/about', icon: Shield },
  { label: 'STATS', href: '/stats', icon: BarChart3 },
  { label: 'ROSTER', href: '/players', icon: Users },
  { label: 'LINEUP', href: '/lineup', icon: ListOrdered },
] as const;

export function FloatingNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  );

  const displayIndex = hoverIndex ?? activeIndex;

  const getIndexFromPosition = useCallback(
    (clientX: number) => {
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right) {
          return i;
        }
      }
      return null;
    },
    [],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const idx = getIndexFromPosition(e.touches[0].clientX);
      if (idx !== null) setHoverIndex(idx);
    },
    [getIndexFromPosition],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const idx = getIndexFromPosition(e.touches[0].clientX);
      if (idx !== null) setHoverIndex(idx);
    },
    [getIndexFromPosition],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setHoverIndex(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const idx = getIndexFromPosition(e.clientX);
      if (idx !== null) setHoverIndex(idx);
    },
    [getIndexFromPosition],
  );

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoverIndex(null);
  }, []);

  return (
    <nav
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-50',
        'px-1.5 py-1.5',
        'rounded-2xl',
        'bg-black/50 backdrop-blur-xl backdrop-saturate-150',
        'border border-white/[0.08]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
      )}
    >
      <div
        ref={navRef}
        className="relative flex items-center gap-0.5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated blob indicator */}
        {displayIndex >= 0 && (
          <motion.div
            className={cn(
              'absolute top-0 bottom-0 rounded-xl pointer-events-none',
              'bg-white/[0.12]',
              'shadow-[inset_0_0.5px_0_rgba(255,255,255,0.15),0_0_12px_rgba(255,255,255,0.04)]',
            )}
            style={{ width: '3.5rem' }}
            animate={{
              x: displayIndex * (56 + 2),
              scale: isDragging ? 1.08 : 1,
              opacity: isDragging ? 0.22 : 0.12,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          const isHovered = i === hoverIndex;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={cn(
                'relative z-10 flex flex-col items-center justify-center',
                'w-14 py-1.5 rounded-xl',
                'transition-colors duration-200',
                isActive || isHovered
                  ? 'text-white'
                  : 'text-white/40',
              )}
            >
              <item.icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-all duration-200"
              />
              <span className="text-[9px] font-medium mt-0.5 leading-none tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
