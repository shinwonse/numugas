import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { PageHeader } from '@/components/page-header';
import type { Metadata } from 'next/types';
import { LedgerApp } from './ledger-app';

export const metadata: Metadata = {
  title: '회계 장부',
  robots: { index: false, follow: false },
};

export default function LedgerPage() {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      <MeshGradientBackground />
      <main className="relative z-10 page-container pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16 text-white">
        <PageHeader eyebrow="Club Ledger" title="회계 장부" />
        <LedgerApp />
      </main>
    </div>
  );
}
