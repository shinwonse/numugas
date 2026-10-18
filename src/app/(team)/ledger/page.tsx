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
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
      </div>
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-16 text-white">
        <PageHeader eyebrow="Club Ledger" title="회계 장부" />
        <LedgerApp />
      </main>
    </div>
  );
}
