import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { PlayerStatsSection } from '@/components/player-stats-section';
import { StatsSection } from '@/components/stats-section';
import { TotalStatsSection } from '@/components/total-stats-section';
import { createClient } from '@supabase/supabase-js';

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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // 모든 데이터를 병렬로 가져옵니다
  const [
    teamTotalStats,
    teamCareerStats,
    battingStats2025,
    pitchingStats2025,
    battingCareerStats,
    pitchingCareerStats,
  ] = await Promise.all([
    // 팀 통산 기록
    (async () => {
      const { data, error } = await supabase
        .from('team_records')
        .select('win, lose, draw');
      if (error) throw error;

      const total = data.reduce(
        (acc, cur) => {
          acc.win += cur.win;
          acc.lose += cur.lose;
          acc.draw += cur.draw;
          return acc;
        },
        { win: 0, lose: 0, draw: 0 },
      );
      const total_games = total.win + total.lose + total.draw;
      const win_rate =
        total_games > 0 ? ((total.win / total_games) * 100).toFixed(1) : '0.0';

      return {
        win_rate,
        win: total.win,
        lose: total.lose,
        draw: total.draw,
      };
    })(),
    // 팀 시즌 기록
    (async () => {
      const { data: hitterStats, error: hitterError } = await supabase
        .from('batter_stats')
        .select('homeruns, totalbases, hits');
      if (hitterError) throw hitterError;

      const { data: pitcherStats, error: pitcherError } = await supabase
        .from('pitcher_stats')
        .select('strikeouts');
      if (pitcherError) throw pitcherError;

      const homeruns = hitterStats.reduce(
        (acc, cur) => acc + Number(cur.homeruns ?? 0),
        0,
      );
      const totalbases = hitterStats.reduce(
        (acc, cur) => acc + Number(cur.totalbases ?? 0),
        0,
      );
      const hits = hitterStats.reduce(
        (acc, cur) => acc + Number(cur.hits ?? 0),
        0,
      );
      const strikeouts = pitcherStats.reduce(
        (acc, cur) => acc + Number(cur.strikeouts ?? 0),
        0,
      );

      return { homeruns, totalbases, hits, strikeouts };
    })(),
    // 2025 타자 기록
    (async () => {
      const { data, error } = await supabase
        .from('batter_stats')
        .select('*')
        .eq('season', '2025');
      if (error) throw error;

      const categories = [
        {
          category: '안타',
          key: 'hits',
          sort: (a: any, b: any) => Number(b.hits) - Number(a.hits),
          value: (p: any) => Number(p.hits),
        },
        {
          category: '홈런',
          key: 'homeruns',
          sort: (a: any, b: any) => Number(b.homeruns) - Number(a.homeruns),
          value: (p: any) => Number(p.homeruns),
        },
        {
          category: '타점',
          key: 'rbi',
          sort: (a: any, b: any) => Number(b.rbi) - Number(a.rbi),
          value: (p: any) => Number(p.rbi),
        },
        {
          category: '도루',
          key: 'stolenbases',
          sort: (a: any, b: any) =>
            Number(b.stolenbases) - Number(a.stolenbases),
          value: (p: any) => Number(p.stolenbases),
        },
      ];

      return categories.map(({ category, sort, value }) => {
        const topPlayers = [...data]
          .filter((p) => value(p) > 0 && p.name)
          .sort(sort)
          .slice(0, 3)
          .map((p, i) => ({
            rank: i + 1,
            name: p.name,
            team: p.team || '',
            value: value(p),
          }));

        return { category, players: topPlayers };
      });
    })(),
    // 2025 투수 기록
    (async () => {
      const { data, error } = await supabase
        .from('pitcher_stats')
        .select('*')
        .eq('season', '2025');
      if (error) throw error;

      const categories = [
        {
          category: '이닝',
          key: 'innings',
          sort: (a: any, b: any) => Number(b.innings) - Number(a.innings),
          value: (p: any) => Number(p.innings),
        },
        {
          category: '승리',
          key: 'wins',
          sort: (a: any, b: any) => Number(b.wins) - Number(a.wins),
          value: (p: any) => Number(p.wins),
        },
        {
          category: '탈삼진',
          key: 'strikeouts',
          sort: (a: any, b: any) => Number(b.strikeouts) - Number(a.strikeouts),
          value: (p: any) => Number(p.strikeouts),
        },
        {
          category: '세이브',
          key: 'saves',
          sort: (a: any, b: any) => Number(b.saves) - Number(a.saves),
          value: (p: any) => Number(p.saves),
        },
      ];

      return categories.map(({ category, sort, value }) => {
        const topPlayers = [...data]
          .filter((p) => value(p) > 0 && p.name)
          .sort(sort)
          .slice(0, 3)
          .map((p, i) => ({
            rank: i + 1,
            name: p.name,
            team: p.team || '',
            value: value(p),
          }));

        return { category, players: topPlayers };
      });
    })(),
    // 타자 통산 기록
    (async () => {
      const { data, error } = await supabase.from('batter_stats').select('*');
      if (error) throw error;

      const categories = [
        {
          category: '안타',
          key: 'hits',
          sort: (a: any, b: any) => Number(b.hits) - Number(a.hits),
          value: (p: any) => Number(p.hits),
        },
        {
          category: '홈런',
          key: 'homeruns',
          sort: (a: any, b: any) => Number(b.homeruns) - Number(a.homeruns),
          value: (p: any) => Number(p.homeruns),
        },
        {
          category: '타점',
          key: 'rbi',
          sort: (a: any, b: any) => Number(b.rbi) - Number(a.rbi),
          value: (p: any) => Number(p.rbi),
        },
        {
          category: '도루',
          key: 'stolenbases',
          sort: (a: any, b: any) =>
            Number(b.stolenbases) - Number(a.stolenbases),
          value: (p: any) => Number(p.stolenbases),
        },
      ];

      return categories.map(({ category, sort, value }) => {
        const topPlayers = [...data]
          .filter((p) => value(p) > 0 && p.name)
          .sort(sort)
          .slice(0, 3)
          .map((p, i) => ({
            rank: i + 1,
            name: p.name,
            team: p.team || '',
            value: value(p),
          }));

        return { category, players: topPlayers };
      });
    })(),
    // 투수 통산 기록
    (async () => {
      const { data, error } = await supabase.from('pitcher_stats').select('*');
      if (error) throw error;

      const categories = [
        {
          category: '이닝',
          key: 'innings',
          sort: (a: any, b: any) => Number(b.innings) - Number(a.innings),
          value: (p: any) => Number(p.innings),
        },
        {
          category: '승리',
          key: 'wins',
          sort: (a: any, b: any) => Number(b.wins) - Number(a.wins),
          value: (p: any) => Number(p.wins),
        },
        {
          category: '탈삼진',
          key: 'strikeouts',
          sort: (a: any, b: any) => Number(b.strikeouts) - Number(a.strikeouts),
          value: (p: any) => Number(p.strikeouts),
        },
        {
          category: '세이브',
          key: 'saves',
          sort: (a: any, b: any) => Number(b.saves) - Number(a.saves),
          value: (p: any) => Number(p.saves),
        },
      ];

      return categories.map(({ category, sort, value }) => {
        const topPlayers = [...data]
          .filter((p) => value(p) > 0 && p.name)
          .sort(sort)
          .slice(0, 3)
          .map((p, i) => ({
            rank: i + 1,
            name: p.name,
            team: p.team || '',
            value: value(p),
          }));

        return { category, players: topPlayers };
      });
    })(),
  ]);

  return {
    teamTotalStats,
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
