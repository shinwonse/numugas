'use client';

import { useParams } from 'next/navigation';
import { StatsPageHeader } from './stats-page-header';

const TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

/**
 * 레이아웃에 두는 헤더(제목 + 타자/투수 탭).
 * 타입·시즌이 바뀌어도 리마운트되지 않아 등장 애니메이션이 다시 재생되지 않는다.
 */
export function StatsShellHeader() {
  const params = useParams<{ type?: string; season?: string }>();
  const type = params.type ? decodeURIComponent(params.type) : 'batter';
  const season = params.season ? decodeURIComponent(params.season) : '2026';

  const tabList = TYPES.map((t) => ({
    key: t.key,
    label: t.label,
    href: `/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`,
    prefetch: true,
  }));

  return <StatsPageHeader tabList={tabList} currentType={type} />;
}
