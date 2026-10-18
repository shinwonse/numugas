import { PageHeader } from '@/components/page-header';
import { fetchCalendarMonth } from '@/lib/fetchers/calendar';
import { CalendarView } from './calendar-view';

export async function CalendarMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const items = await fetchCalendarMonth(year, month);

  return (
    <main className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-white">
      <PageHeader eyebrow="Club Calendar" title="구단 캘린더" />
      <CalendarView
        key={`${year}-${month}`}
        year={year}
        month={month}
        items={items}
      />
    </main>
  );
}
