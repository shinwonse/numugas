import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import type { ReactNode } from 'react';
import { StatsShellHeader } from './stats-shell';

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      <MeshGradientBackground />

      <main className="relative z-10 flex flex-col pt-20 pb-16 min-h-screen">
        <div className="page-container">
          <StatsShellHeader />
          {children}
        </div>
      </main>
    </div>
  );
}

