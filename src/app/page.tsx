import { SectionDivider } from '@/components/animated/section-divider';
import { ErrorBoundary } from '@/components/error-boundary';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import { StatsSection } from '@/components/stats-section';
import { TotalStatsSection } from '@/components/total-stats-section';
import { YoutubeErrorFallback } from '@/components/youtube-section';
import { YoutubeSectionWrapper } from '@/components/youtube-section-wrapper';
import {
  fetchBattingCareerStats,
  fetchBattingStats2026,
  fetchPitchingCareerStats,
  fetchPitchingStats2026,
  fetchTeamCareerStats,
  fetchTeamTotalStats,
} from '@/lib/api';
import { Suspense } from 'react';

interface Player {
  rank: number;
  name: string;
  team: string;
  value: number;
}

interface Stat {
  category: string;
  players: Player[];
}

interface TeamTotalStats {
  win_rate: string;
  win: number;
  lose: number;
  draw: number;
}

interface TeamCareerStats {
  homeruns: number;
  totalbases: number;
  hits: number;
  strikeouts: number;
}

interface HomeProps {
  teamTotalStats: TeamTotalStats;
  teamCareerStats: TeamCareerStats;
  battingStats2026: Stat[];
  pitchingStats2026: Stat[];
  battingCareerStats: Stat[];
  pitchingCareerStats: Stat[];
}

// Remove force-static and use dynamic rendering with caching
export const revalidate = 3600; // Cache for 1 hour

// 데이터를 가져오는 함수 with error handling
async function getHomeData(): Promise<HomeProps> {
  try {
    const [
      teamTotalStats,
      teamCareerStats,
      battingStats2026,
      pitchingStats2026,
      battingCareerStats,
      pitchingCareerStats,
    ] = await Promise.all([
      fetchTeamTotalStats(),
      fetchTeamCareerStats(),
      fetchBattingStats2026(),
      fetchPitchingStats2026(),
      fetchBattingCareerStats(),
      fetchPitchingCareerStats(),
    ]);

    return {
      teamTotalStats: {
        win: teamTotalStats.win,
        lose: teamTotalStats.lose,
        draw: teamTotalStats.draw,
        win_rate: teamTotalStats.win_rate.toFixed(1),
      },
      teamCareerStats,
      battingStats2026,
      pitchingStats2026,
      battingCareerStats,
      pitchingCareerStats,
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);

    // Return fallback data structure
    return {
      teamTotalStats: {
        win: 0,
        lose: 0,
        draw: 0,
        win_rate: '0.0',
      },
      teamCareerStats: {
        homeruns: 0,
        totalbases: 0,
        hits: 0,
        strikeouts: 0,
      },
      battingStats2026: [],
      pitchingStats2026: [],
      battingCareerStats: [],
      pitchingCareerStats: [],
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <HeroSection />

      <SectionDivider />
      <StatsSection
        teamTotalStats={data.teamTotalStats}
        teamCareerStats={data.teamCareerStats}
      />

      <SectionDivider />
      <PlayerStatsSection
        battingStats={data.battingStats2026}
        pitchingStats={data.pitchingStats2026}
      />

      <SectionDivider />
      <TotalStatsSection
        battingStats={data.battingCareerStats}
        pitchingStats={data.pitchingCareerStats}
      />

      <SectionDivider />
      <ErrorBoundary fallback={<YoutubeErrorFallback />}>
        <Suspense>
          <YoutubeSectionWrapper />
        </Suspense>
      </ErrorBoundary>

      {/* <ScheduleSection /> */}
      <Footer />
    </main>
  );
}
