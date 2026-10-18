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
        <PageHeader eyebrow="Team Only" title="팀 메뉴" />
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {TEAM_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <item.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      {item.label}
                    </span>
                    {item.locked && (
                      <>
                        <Lock aria-hidden className="h-3 w-3 text-white/40" />
                        <span className="sr-only">(비밀번호 필요)</span>
                      </>
                    )}
                  </span>
                  <span className="mt-0.5 block text-lg font-bold">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-white/60">
                    {item.description}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-white/30 transition-colors duration-200 group-hover:text-white/70"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
