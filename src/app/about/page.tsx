import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { SectionBackground } from '@/components/animated/section-background';
import { Footer } from '@/components/footer';
import { PageHeader } from '@/components/page-header';
import { HistoryTimeline } from '@/components/history-timeline';
import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '팀 소개',
  description: '담장NUMUGAS 야구팀의 연혁과 역사를 확인하세요.',
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <MeshGradientBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pb-24">
        <SectionBackground variant="gradient" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <PageHeader eyebrow="History" title="담장NUMUGAS" className="mb-0" />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 lg:px-12 pb-32">
        <HistoryTimeline />
      </section>

      <Footer />
    </main>
  );
}
