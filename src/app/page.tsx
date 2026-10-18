import { SectionDivider } from '@/components/animated/section-divider';
import { ErrorBoundary } from '@/components/error-boundary';
import { Footer } from '@/components/footer';
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
  fetchSeasonBattingLeaders,
  fetchPitchingCareerStats,
  fetchSeasonPitchingLeaders,
  fetchTeamCareerStats,
  fetchTeamTotalStats,
} from '@/lib/fetchers';
import { getCurrentSeason } from '@/lib/seasons';
import { Suspense } from 'react';

// On-demand revalidation only — triggered from /admin page
export const revalidate = false;

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
  const season = getCurrentSeason();
  const [battingStats, pitchingStats] = await Promise.all([
    fetchSeasonBattingLeaders(season),
    fetchSeasonPitchingLeaders(season),
  ]);

  return (
    <PlayerStatsSection
      season={season}
      battingStats={battingStats}
      pitchingStats={pitchingStats}
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

      <Footer />
    </main>
  );
}
