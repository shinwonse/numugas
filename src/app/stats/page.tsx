import type { Metadata } from 'next/types';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '기록실',
  description:
    '담장NUMUGAS 타자/투수 시즌별 통계 기록을 확인하세요. 타율, 홈런, 타점, 방어율 등 상세 기록을 제공합니다.',
};

export default function StatsPage() {
  redirect('/stats/batter/2026');
}
