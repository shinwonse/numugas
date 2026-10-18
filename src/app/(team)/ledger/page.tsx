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
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-16 text-white">
        <PageHeader eyebrow="Club Ledger" title="회계 장부" />
        <LedgerApp />
      </main>
    </div>
  );
}
