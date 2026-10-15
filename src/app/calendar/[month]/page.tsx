import { parseMonthParam } from '@/lib/calendar-utils';
import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import { CalendarMonth } from '../calendar-month';

export const revalidate = 300;

// 방문 시 생성 후 ISR 캐시
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const parsed = parseMonthParam((await params).month);
  if (!parsed) return { title: '구단 캘린더' };
  return {
    title: `구단 캘린더 - ${parsed.year}년 ${parsed.month}월`,
    description: `담장NUMUGAS ${parsed.year}년 ${parsed.month}월 경기 및 구단 일정입니다.`,
  };
}

export default async function CalendarMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const parsed = parseMonthParam((await params).month);
  if (!parsed) notFound();
  return <CalendarMonth year={parsed.year} month={parsed.month} />;
}
