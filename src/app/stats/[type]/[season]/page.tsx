import {
  fetchBattingStatsBySeason,
  fetchPitchingStatsBySeason,
} from '@/lib/fetchers/season-stats';
import { LEAGUES, type League } from '@/lib/leagues';
import { getStatsSeasons } from '@/lib/seasons';
import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import StatsTableClient from './stats-table-client';

export const revalidate = 300;

const SEASONS = getStatsSeasons();
const TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; season: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
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
  params: Promise<{ type: string; season: string }>;
  searchParams: Promise<{ league?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
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

  return (
    <StatsTableClient type={type} season={season} initialData={data} />
  );
}
