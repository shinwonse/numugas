import { SectionDivider } from '@/components/animated/section-divider';
import { ErrorBoundary } from '@/components/error-boundary';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import {
  PlayerStatsSectionSkeleton,
  StatsSectionSkeleton,
  TotalStatsSectionSkeleton,
} from '@/components/section-skeleton';
import { StatsSection } from '@/components/stats-section';
import { TotalStatsSection } from '@/components/total-stats-section';
import {
  YoutubeErrorFallback,
  YoutubeLoadingFallback,
} from '@/components/youtube-section';
import { YoutubeSectionWrapper } from '@/components/youtube-section-wrapper';
import {
  fetchBattingCareerStats,
  fetchBattingStats2026,
  fetchPitchingCareerStats,
  fetchPitchingStats2026,
  fetchTeamCareerStats,
  fetchTeamTotalStats,
} from '@/lib/fetchers';
import { Suspense } from 'react';

// Remove force-static and use dynamic rendering with caching
export const revalidate = 3600; // Cache for 1 hour

async function StatsSectionData() {
  const [teamTotalStats, teamCareerStats] = await Promise.all([
    fetchTeamTotalStats(),
    fetchTeamCareerStats(),
  ]);

  return (
    <StatsSection
      teamTotalStats={{
        win: teamTotalStats.win,
        lose: teamTotalStats.lose,
        draw: teamTotalStats.draw,
        win_rate: teamTotalStats.win_rate.toFixed(1),
      }}
      teamCareerStats={teamCareerStats}
    />
  );
}

async function PlayerStatsSectionData() {
  const [battingStats2026, pitchingStats2026] = await Promise.all([
    fetchBattingStats2026(),
    fetchPitchingStats2026(),
  ]);

  return (
    <PlayerStatsSection
      battingStats={battingStats2026}
      pitchingStats={pitchingStats2026}
    />
  );
}

async function TotalStatsSectionData() {
  const [battingCareerStats, pitchingCareerStats] = await Promise.all([
    fetchBattingCareerStats(),
    fetchPitchingCareerStats(),
  ]);

  return (
    <TotalStatsSection
      battingStats={battingCareerStats}
      pitchingStats={pitchingCareerStats}
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <HeroSection />

      <SectionDivider />
      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSectionData />
      </Suspense>

      <SectionDivider />
      <Suspense fallback={<PlayerStatsSectionSkeleton />}>
        <PlayerStatsSectionData />
      </Suspense>

      <SectionDivider />
      <Suspense fallback={<TotalStatsSectionSkeleton />}>
        <TotalStatsSectionData />
      </Suspense>

      <SectionDivider />
      <ErrorBoundary fallback={<YoutubeErrorFallback />}>
        <Suspense fallback={<YoutubeLoadingFallback />}>
          <YoutubeSectionWrapper />
        </Suspense>
      </ErrorBoundary>

      {/* <ScheduleSection /> */}
      <Footer />
    </main>
  );
}
