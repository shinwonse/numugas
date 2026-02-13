import { SectionBackground } from '@/components/animated/section-background';
import { Footer } from '@/components/footer';
import { HistoryTimeline } from '@/components/history-timeline';
import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '팀 소개',
  description: '담장NUMUGAS 야구팀의 연혁과 역사를 확인하세요.',
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background mesh gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
        <SectionBackground variant="gradient" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <p className="font-orbitron text-xs md:text-sm tracking-[0.3em] text-red-400/80 uppercase mb-4">
            History
          </p>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              담장NUMUGAS의 발자취
            </span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-md mx-auto">
            야구를 사랑하는 우리 팀의 이야기
          </p>
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
