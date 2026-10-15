'use client';

import { SectionBackground } from '@/components/animated/section-background';
import { SectionTitle } from '@/components/animated/section-title';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { itemColors, itemLabel } from '@/lib/calendar-styles';
import { isUpcoming, toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MAX_ITEMS = 4;

interface UpcomingScheduleSectionProps {
  items: CalendarItem[];
  /** 서버 렌더 시각 — 첫 렌더를 서버와 맞춰 hydration 불일치를 막는다 */
  renderedAt: number;
}

export function UpcomingScheduleSection({
  items,
  renderedAt,
}: UpcomingScheduleSectionProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });

  // 홈은 on-demand 재검증이라 HTML이 오래될 수 있어 마운트 후 현재 시각으로 다시 거른다
  const [now, setNow] = useState(renderedAt);
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const upcoming = items
    .filter((item) =>
      isUpcoming(
        {
          startsAt: item.startsAt,
          endsAt: item.kind === 'event' ? item.endsAt : null,
          allDay: item.kind === 'event' && item.allDay,
        },
        now,
      ),
    )
    .slice(0, MAX_ITEMS);

  return (
    <section
      id="다가오는일정"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(80px)',
        transition: 'opacity 1s ease-out, transform 1s ease-out',
      }}
    >
      <SectionBackground variant="lines" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <SectionTitle
          subtitle="UPCOMING"
          title="다가오는 일정"
          isInView={isInView}
        />

        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-white/40">
            예정된 일정이 없습니다
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcoming.map((item, i) => (
              <li
                key={item.id}
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ${0.1 * i}s, transform 0.6s ${0.1 * i}s`,
                }}
              >
                <UpcomingCard item={item} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/calendar"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium',
              'bg-white/5 border border-white/10 text-white/80',
              'hover:bg-white/10 hover:text-white transition-colors',
            )}
          >
            전체 일정 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function UpcomingCard({ item }: { item: CalendarItem }) {
  const dateKey = toKstDateKey(item.startsAt);
  const month = Number(dateKey.slice(5, 7));
  const day = Number(dateKey.slice(8));
  const weekday = WEEKDAYS[new Date(`${dateKey}T00:00:00Z`).getUTCDay()];
  const time =
    item.kind === 'event' && item.allDay ? '종일' : toKstTime(item.startsAt);

  return (
    <Link
      href={`/calendar/${dateKey.slice(0, 7)}`}
      className={cn(
        'flex h-full gap-4 rounded-2xl p-5',
        'bg-white/[0.03] border border-white/10 backdrop-blur-xl',
        'hover:bg-white/[0.06] hover:border-white/20 transition-colors',
      )}
    >
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white/5 py-2">
        <span className="text-xs text-white/50 tabular-nums">{month}월</span>
        <span className="text-2xl font-bold tabular-nums leading-tight">
          {day}
        </span>
        <span
          className={cn(
            'text-xs',
            weekday === '일'
              ? 'text-rose-400'
              : weekday === '토'
                ? 'text-sky-400'
                : 'text-white/50',
          )}
        >
          {weekday}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium',
            itemColors(item).chip,
          )}
        >
          {itemLabel(item)}
        </span>
        <p className="mt-1.5 truncate font-semibold">{item.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/50 tabular-nums">
          <Clock className="h-3 w-3" />
          {time}
        </p>
        {item.location && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/50">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
