import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import { StatsSection } from '@/components/stats-section';
import { TotalStatsSection } from '@/components/total-stats-section';
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

// 페이지를 정적으로 생성하기 위한 설정
export const dynamic = 'force-static';
export const revalidate = 86400; // 24시간마다 재생성

// 정적 데이터를 가져오는 함수
async function getStaticData(): Promise<HomeProps> {
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
}

export default async function Home() {
  const data = await getStaticData();

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
      {/* <ScheduleSection /> */}
      <Footer />
    </main>
  );
}
