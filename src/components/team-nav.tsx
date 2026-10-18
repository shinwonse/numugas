import { cn } from '@/lib/cn';
import { TEAM_HUB_HREF } from '@/lib/team-menu';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

/** 팀 하위 페이지 상단의 `TEAM` 허브로 돌아가는 버튼 */
export function TeamNav() {
  return (
    <nav
      aria-label="팀 메뉴"
      className={cn(
        'fixed z-40 left-4 md:left-6',
        'top-[calc(1rem+env(safe-area-inset-top))]',
        'rounded-xl',
        'bg-black/50 backdrop-blur-xl backdrop-saturate-150',
        'border border-white/[0.08]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
      )}
    >
      <Link
        href={TEAM_HUB_HREF}
        className="flex min-h-11 items-center gap-0.5 rounded-xl pl-2 pr-4 text-xs font-medium tracking-wide text-white/70 transition-colors duration-200 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        TEAM
      </Link>
    </nav>
  );
}
