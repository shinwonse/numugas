import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { PageHeader } from '@/components/page-header';
import { TEAM_ITEMS } from '@/lib/team-menu';
import { ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '팀 메뉴',
  robots: { index: false, follow: false },
};

export default function TeamHubPage() {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      <MeshGradientBackground />
      <main className="relative z-10 page-container pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16 text-white">
        <PageHeader eyebrow="팀원 전용" title="팀 메뉴" />
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {TEAM_ITEMS.map((item, i) => (
            <li
              key={item.href}
              style={{ animation: `fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${String(i * 0.06)}s both` }}
            >
              <Link
                href={item.href}
                className="group relative flex h-full items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                {/* 호버하면 왼쪽 붉은 선이 위에서 아래로 그어진다 */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-red-500 transition-transform duration-300 group-hover:scale-y-100"
                />
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-400 transition-colors duration-300 group-hover:bg-red-500 group-hover:text-white">
                  <item.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-lg font-bold">
                    {item.title}
                    {item.locked && (
                      <>
                        <Lock aria-hidden className="h-3.5 w-3.5 text-white/40" />
                        <span className="sr-only">(비밀번호 필요)</span>
                      </>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/60">
                    {item.description}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-white/30 transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-white/70"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
