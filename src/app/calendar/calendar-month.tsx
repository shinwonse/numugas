import { formatMonthParam, shiftMonth } from '@/lib/calendar-utils';
import { cn } from '@/lib/cn';
import { fetchCalendarMonth } from '@/lib/fetchers/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { CalendarView } from './calendar-view';

const navButton = cn(
  'flex h-10 w-10 items-center justify-center rounded-xl',
  'bg-white/5 border border-white/10 text-white/70',
  'hover:bg-white/10 hover:text-white transition-colors',
);

export async function CalendarMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const items = await fetchCalendarMonth(year, month);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);

  return (
    <main className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-white">
      <PageHeader eyebrow="Club Calendar" title="구단 캘린더" />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/calendar/${formatMonthParam(prev.year, prev.month)}`}
          className={navButton}
          aria-label="이전 달"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl md:text-2xl font-bold tabular-nums">
          {year}년 {month}월
        </h2>
        <Link
          href={`/calendar/${formatMonthParam(next.year, next.month)}`}
          className={navButton}
          aria-label="다음 달"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <CalendarView
        key={`${year}-${month}`}
        year={year}
        month={month}
        items={items}
      />
    </main>
  );
}
