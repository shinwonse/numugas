import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import type { ReactNode } from 'react';
import { StatsShellHeader } from './stats-shell';

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      <MeshGradientBackground />

      <main className="relative z-10 flex flex-col pt-20 pb-16 md:pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
          <StatsShellHeader />
          {children}
        </div>
      </main>
    </div>
  );
}

