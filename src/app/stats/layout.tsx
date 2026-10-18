import type { ReactNode } from 'react';
import { StatsShellHeader } from './stats-shell';

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      {/* Apple-style mesh gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col pt-20 pb-16 md:pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
          <StatsShellHeader />
          {children}
        </div>
      </main>
    </div>
  );
}

