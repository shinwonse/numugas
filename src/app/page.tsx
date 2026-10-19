import { SectionDivider } from '@/components/animated/section-divider';
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
import { YoutubeSection } from '@/components/youtube-section';
import {
  fetchBattingCareerStats,
  fetchSeasonBattingLeaders,
  fetchPitchingCareerStats,
  fetchSeasonPitchingLeaders,
  fetchTeamCareerStats,
  fetchTeamTotalStats,
} from '@/lib/fetchers';
import { fetchTeamGameRecords } from '@/lib/fetchers/team-game-records';
import { fetchLatestYouTubeVideo } from '@/lib/fetchers/youtube';
import { getCurrentSeason } from '@/lib/seasons';
import { Suspense } from 'react';

// On-demand revalidation only — triggered from /admin page
export const revalidate = false;

async function StatsSectionData() {
  const [teamTotalStats, teamCareerStats, teamGameRecords] = await Promise.all([
    fetchTeamTotalStats(),
    fetchTeamCareerStats(),
    fetchTeamGameRecords(),
  ]);

  return (
    <StatsSection
      teamTotalStats={{
        win: teamTotalStats.win,
        lose: teamTotalStats.lose,
        draw: teamTotalStats.draw,
        win_rate: teamTotalStats.win_rate.toFixed(3),
      }}
      teamCareerStats={teamCareerStats}
      longestWinStreak={teamGameRecords.longestWinStreak}
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

async function YoutubeSectionData() {
  const video = await fetchLatestYouTubeVideo();
  // 영상을 못 가져오면 섹션을 통째로 숨긴다
  if (!video) return null;

  return (
    <>
      <SectionDivider />
      <YoutubeSection video={video} />
    </>
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

      <Suspense>
        <YoutubeSectionData />
      </Suspense>

      <Footer />
    </main>
  );
}
