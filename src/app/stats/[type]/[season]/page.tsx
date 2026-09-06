import {
  fetchBattingStatsBySeason,
  fetchPitchingStatsBySeason,
} from '@/lib/fetchers/season-stats';
import { LEAGUES, type League } from '@/lib/leagues';
import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import { StatsPageHeader } from './stats-page-header';
import StatsTableClient from './stats-table-client';

export const revalidate = 300;

const SEASONS = ['통산', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

export async function generateMetadata({
  params,
}: {
  params: { type: string; season: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const type = decodeURIComponent(resolvedParams.type);
  const season = decodeURIComponent(resolvedParams.season);
  const typeObj = TYPES.find((t) => t.key === type);

  const label = typeObj?.label || '기록';
  const seasonLabel = season === '통산' ? '통산' : `${season}시즌`;

  return {
    title: `${label} - ${seasonLabel}`,
    description: `담장NUMUGAS ${seasonLabel} ${label}을 확인하세요.`,
  };
}

const NO_ROWS: any[] = [];

export async function generateStaticParams() {
  return TYPES.flatMap((type) =>
    SEASONS.map((season) => ({ type: type.key, season })),
  );
}

export default async function StatsTypeSeasonPage({
  params,
  searchParams,
}: {
  params: { type: string; season: string };
  searchParams: { league?: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams);
  const type = decodeURIComponent(resolvedParams.type);
  const season = decodeURIComponent(resolvedParams.season);
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  const leagueParam = resolvedSearch?.league;
  const league =
    leagueParam && (LEAGUES as readonly string[]).includes(leagueParam)
      ? (leagueParam as League)
      : undefined;

  const seasonArg = season === '통산' ? undefined : season;
  // 조회 실패는 캐시하지 않는다 (fetcher가 throw). 여기서만 빈 테이블로 흡수한다.
  let data = NO_ROWS;
  try {
    data =
      type === 'batter'
        ? await fetchBattingStatsBySeason(seasonArg, league)
        : await fetchPitchingStatsBySeason(seasonArg, league);
  } catch (e) {
    console.error(`[stats] ${type}/${season} 조회 실패`, e);
  }

  const tabList = TYPES.map((t) => ({
    key: t.key,
    label: t.label,
    href: `/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`,
  }));

  return (
    <main className="flex flex-col pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <StatsPageHeader tabList={tabList} currentType={type} />
        <StatsTableClient type={type} season={season} initialData={data} />
      </div>
    </main>
  );
}
