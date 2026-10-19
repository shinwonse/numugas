'use client';

import { TEAM_STATS_HREF } from '@/lib/opponents';
import { getCurrentSeason } from '@/lib/seasons';
import { useParams, usePathname } from 'next/navigation';
import { StatsPageHeader } from './stats-page-header';

const PLAYER_TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

/**
 * 레이아웃에 두는 헤더(제목 + 타자/투수/팀 기록 탭).
 * 타입·시즌이 바뀌어도 리마운트되지 않아 등장 애니메이션이 다시 재생되지 않는다.
 */
export function StatsShellHeader() {
  const params = useParams<{ type?: string; season?: string }>();
  const pathname = usePathname();
  const isTeam = pathname.startsWith(TEAM_STATS_HREF);
  const type = isTeam
    ? 'team'
    : params.type
      ? decodeURIComponent(params.type)
      : 'batter';
  const season = params.season ? decodeURIComponent(params.season) : getCurrentSeason();

  const tabList = [
    ...PLAYER_TYPES.map((t) => ({
      key: t.key,
      label: t.label,
      href: `/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`,
      prefetch: true,
    })),
    { key: 'team', label: '팀 기록', href: TEAM_STATS_HREF, prefetch: true },
  ];

  return (
    <StatsPageHeader
      eyebrow={isTeam ? 'Team Statistics' : 'Player Statistics'}
      title={isTeam ? '팀 기록' : '선수 기록'}
      tabList={tabList}
      currentType={type}
    />
  );
}
