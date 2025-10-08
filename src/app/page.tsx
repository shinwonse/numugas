import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import { StatsSection } from '@/components/stats-section';
import { TotalStatsSection } from '@/components/total-stats-section';
import { YoutubeSection } from '@/components/youtube-section';
import {
  fetchBattingCareerStats,
  fetchBattingStats2025,
  fetchPitchingCareerStats,
  fetchPitchingStats2025,
  fetchTeamCareerStats,
  fetchTeamTotalStats,
} from '@/lib/api';

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
  battingStats2025: Stat[];
  pitchingStats2025: Stat[];
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
      battingStats2025,
      pitchingStats2025,
      battingCareerStats,
      pitchingCareerStats,
    ] = await Promise.all([
      fetchTeamTotalStats(),
      fetchTeamCareerStats(),
      fetchBattingStats2025(),
      fetchPitchingStats2025(),
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
      battingStats2025,
      pitchingStats2025,
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
      battingStats2025: [],
      pitchingStats2025: [],
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
      <StatsSection
        teamTotalStats={data.teamTotalStats}
        teamCareerStats={data.teamCareerStats}
      />
      <PlayerStatsSection
        battingStats={data.battingStats2025}
        pitchingStats={data.pitchingStats2025}
      />
      <TotalStatsSection
        battingStats={data.battingCareerStats}
        pitchingStats={data.pitchingCareerStats}
      />
      <YoutubeSection />
      {/* <ScheduleSection /> */}
      <Footer />
    </main>
  );
}
