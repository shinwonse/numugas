'use client';

import { cn } from '@/lib/cn';
import { ListOrdered, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** 팀원 전용 페이지들. 하단 네비의 TEAM 탭이 이 경로들을 묶는다. */
export const TEAM_ITEMS = [
  { label: 'LINEUP', href: '/lineup', icon: ListOrdered },
  { label: 'LEDGER', href: '/ledger', icon: Wallet },
] as const;

export function TeamNav() {
  const pathname = usePathname();
  const activeIndex = TEAM_ITEMS.findIndex((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <nav
      aria-label="팀 메뉴"
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-40',
        'top-[calc(1rem+env(safe-area-inset-top))]',
        'p-1 rounded-xl',
        'bg-black/50 backdrop-blur-xl backdrop-saturate-150',
        'border border-white/[0.08]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
      )}
    >
      <div className="relative grid grid-cols-2 gap-0.5">
        {/* 선택 표시: 두 칸 너비가 같아 인덱스만큼 옮긴다 (팀 레이아웃에 있어 페이지 이동 시 미끄러진다) */}
        {activeIndex >= 0 && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[calc(50%-1px)] rounded-lg bg-white/[0.12] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.36,0.64,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 2}px))` }}
          />
        )}
        {TEAM_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg',
                'text-[11px] font-medium tracking-wide',
                'transition-colors duration-200',
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70',
              )}
            >
              <item.icon size={14} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
