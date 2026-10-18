'use client';

import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { ListOrdered, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** 팀원 전용 페이지들. 하단 네비의 TEAM 탭이 이 경로들을 묶는다. */
export const TEAM_ITEMS = [
  { label: 'LINEUP', href: '/lineup', icon: ListOrdered },
  { label: 'LEDGER', href: '/ledger', icon: Wallet },
] as const;

const INDICATOR_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const;

export function TeamNav() {
  const pathname = usePathname();

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
      <div className="flex items-center gap-0.5">
        {TEAM_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg',
                'text-[11px] font-medium tracking-wide',
                'transition-colors duration-200',
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="team-nav-indicator"
                  className="absolute inset-0 rounded-lg bg-white/[0.12] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.15)]"
                  transition={INDICATOR_SPRING}
                />
              )}
              <item.icon size={14} strokeWidth={isActive ? 2 : 1.5} className="relative" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
