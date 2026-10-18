'use client';

import type { League } from '@/lib/leagues';
import type { StatsType } from '../../stats-columns';
import { StatsTable } from '../../stats-table';

interface StatsTableClientProps {
  type: StatsType;
  season: string;
  league: League | undefined;
  initialData: Record<string, unknown>[];
}

export default function StatsTableClient(props: StatsTableClientProps) {
  // 시즌·리그가 바뀌면 정렬·검색 상태를 새로 시작한다
  return <StatsTable key={`${props.type}-${props.season}-${props.league ?? 'ALL'}`} {...props} />;
}
