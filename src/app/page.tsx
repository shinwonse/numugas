import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { PlayerStatsSection } from "@/components/player-stats-section"
import { ScheduleSection } from "@/components/schedule-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />
      <Header />
      <HeroSection />
      <StatsSection />
      <PlayerStatsSection />
      <ScheduleSection />
      <NewsSection />
      <Footer />
    </main>
  )
}
