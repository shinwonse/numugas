import {
  fetchBattingStatsBySeason,
  fetchPitchingStatsBySeason,
} from '@/lib/fetchers/season-stats';
import { getLeaguesForSeason, LEAGUES, type League } from '@/lib/leagues';
import { getStatsSeasons } from '@/lib/seasons';
import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import type { StatsType } from '../../../stats-columns';
import StatsTableClient from '../stats-table-client';

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


/** 시즌에서 고를 수 있는 리그 (통산은 전체 리그) */
function leaguesFor(season: string): readonly League[] {
  return season === '통산' ? LEAGUES : getLeaguesForSeason(season);
}

// 리그 필터를 경로(/stats/batter/2026/ECOKING)로 받아 페이지 전체를 정적으로 캐시한다
export function generateStaticParams() {
  return TYPES.flatMap((type) =>
    SEASONS.flatMap((season) => [
      { type: type.key, season, league: [] },
      ...leaguesFor(season).map((league) => ({
        type: type.key,
        season,
        league: [league],
      })),
    ]),
  );
}

export default async function StatsTypeSeasonPage({
  params,
}: {
  params: Promise<{ type: string; season: string; league?: string[] }>;
}) {
  const resolvedParams = await params;
  const type = decodeURIComponent(resolvedParams.type);
  const season = decodeURIComponent(resolvedParams.season);
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  const leagueSegments = resolvedParams.league ?? [];
  if (leagueSegments.length > 1) notFound();
  const leagueParam = leagueSegments[0];
  const league = leaguesFor(season).find((l) => l === leagueParam);
  if (leagueParam && !league) notFound();

  const seasonArg = season === '통산' ? undefined : season;
  // 조회 실패는 던져서 에러 화면을 보여주고, ISR에 빈 표가 캐시되지 않게 한다
  const data =
    type === 'batter'
      ? await fetchBattingStatsBySeason(seasonArg, league)
      : await fetchPitchingStatsBySeason(seasonArg, league);

  return (
    <StatsTableClient
      type={type as StatsType}
      season={season}
      league={league}
      initialData={data}
    />
  );
}
