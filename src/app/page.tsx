import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { NewsSection } from '@/components/news-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import { ScheduleSection } from '@/components/schedule-section';
import { StatsSection } from '@/components/stats-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <HeroSection />
      <StatsSection />
      <PlayerStatsSection />
      <ScheduleSection />
      <NewsSection />
      <Footer />
    </main>
  );
}
