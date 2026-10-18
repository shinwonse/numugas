import { toKstDateKey } from '@/lib/calendar-utils';
import { fetchCalendarItem } from '@/lib/fetchers/calendar';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { EventDetail } from '../../event-detail';

export const revalidate = 300;

// 방문 시 생성 후 ISR 캐시
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const item = await fetchCalendarItem((await params).id);
  return {
    title: item ? `${item.title} - 구단 캘린더` : '구단 캘린더',
    robots: { index: false },
  };
}

/** 일정 상세 페이지: 링크로 직접 들어오거나 새로고침했을 때 보이는 화면 */
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const item = await fetchCalendarItem((await params).id);
  if (!item) notFound();
  const monthHref = `/calendar/${toKstDateKey(item.startsAt).slice(0, 7)}`;

  return (
    <main className="mx-auto max-w-lg px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-16 text-white md:pt-20">
      <Link
        href={monthHref}
        className="mb-4 -ml-1 inline-flex h-11 items-center gap-0.5 rounded-xl pl-1 pr-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
        캘린더
      </Link>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
        <EventDetail item={item} deletedHref={monthHref} />
      </div>
    </main>
  );
}
