'use client';

import { cn } from '@/lib/cn';
import { TEAM_HUB_HREF, TEAM_ITEMS } from '@/lib/team-menu';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Home,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { label: 'HOME', href: '/', icon: Home, match: ['/'] },
  { label: 'ABOUT', href: '/about', icon: Shield, match: ['/about'] },
  { label: 'STATS', href: '/stats', icon: BarChart3, match: ['/stats'] },
  { label: 'ROSTER', href: '/players', icon: Users, match: ['/players'] },
  {
    label: 'CALENDAR',
    href: '/calendar',
    icon: CalendarDays,
    match: ['/calendar'],
  },
  {
    label: 'TEAM',
    href: TEAM_HUB_HREF,
    icon: ClipboardList,
    match: [TEAM_HUB_HREF, ...TEAM_ITEMS.map((item) => item.href)],
  },
] as const;

const isMatch = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

export function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.match.some((href) => isMatch(pathname, href)),
  );

  const displayIndex = hoverIndex ?? activeIndex;

  // null이면 아직 측정 전 → blob을 그리지 않고, 첫 측정 위치에 애니메이션 없이 놓는다
  const [blobPos, setBlobPos] = useState<{ x: number; width: number } | null>(
    null,
  );
  // 첫 위치를 그린 다음 프레임부터 transition을 켠다 (처음엔 날아오지 않게)
  const [blobAnimated, setBlobAnimated] = useState(false);
  const hasBlob = blobPos !== null;
  useEffect(() => {
    if (!hasBlob) {
      setBlobAnimated(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      setBlobAnimated(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [hasBlob]);

  const updateBlobPos = useCallback((index: number) => {
    const el = itemRefs.current[index];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setBlobPos({ x: elRect.left - navRect.left, width: elRect.width });
  }, []);

  useLayoutEffect(() => {
    if (displayIndex < 0) {
      setBlobPos(null);
      return;
    }
    updateBlobPos(displayIndex);

    // 브레이크포인트(w-[3.25rem] ↔ w-14 ↔ w-20)나 회전으로 탭 크기가 바뀌면 다시 측정
    const nav = navRef.current;
    if (!nav) return;
    const observer = new ResizeObserver(() => {
      updateBlobPos(displayIndex);
    });
    observer.observe(nav);
    return () => {
      observer.disconnect();
    };
  }, [displayIndex, updateBlobPos]);

  const getIndexFromPosition = useCallback((clientX: number) => {
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        return i;
      }
    }
    return null;
  }, []);

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

  // 손을 뗀 위치의 탭으로 이동. 드래그하면 브라우저가 클릭을 취소하므로 직접 이동하고,
  // 탭(클릭)과 중복 이동하지 않도록 기본 동작을 막는다.
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (hoverIndex !== null && hoverIndex !== activeIndex) {
        e.preventDefault();
        router.push(NAV_ITEMS[hoverIndex].href);
      }
      setIsDragging(false);
      setHoverIndex(null);
    },
    [hoverIndex, activeIndex, router],
  );

  const handleTouchCancel = useCallback(() => {
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
    setHoverIndex(null);
  }, []);

  return (
    <nav
      aria-label="주 메뉴"
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50',
        'bottom-[calc(1.25rem+env(safe-area-inset-bottom))]',
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
        onTouchCancel={handleTouchCancel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated blob indicator */}
        {displayIndex >= 0 && blobPos && (
          <div
            className={cn(
              'absolute top-0 bottom-0 left-0 rounded-xl pointer-events-none',
              'shadow-[inset_0_0.5px_0_rgba(255,255,255,0.15),0_0_12px_rgba(255,255,255,0.04)]',
              isDragging ? 'bg-white/[0.22]' : 'bg-white/[0.12]',
              // 살짝 튀는 스프링 느낌의 곡선
              blobAnimated &&
                'transition-[transform,width,background-color] duration-300 ease-[cubic-bezier(0.34,1.36,0.64,1)] motion-reduce:transition-none',
            )}
            style={{
              width: blobPos.width,
              transform: `translateX(${blobPos.x}px) scale(${isDragging ? 1.08 : 1})`,
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
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
              className={cn(
                'relative z-10 flex items-center justify-center',
                'w-[3.25rem] min-[380px]:w-14 md:w-20 h-11 rounded-xl',
                'transition-colors duration-200',
                isActive || isHovered ? 'text-white' : 'text-white/40',
              )}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                aria-hidden
                className="transition-all duration-200"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
