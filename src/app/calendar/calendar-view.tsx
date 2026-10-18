'use client';

import {
  buildMonthGrid,
  formatMonthParam,
  shiftMonth,
  toKstDateKey,
  todayKstKey,
  WEEKDAY_LABELS,
} from '@/lib/calendar-utils';
import { itemColors } from '@/lib/calendar-styles';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCalendarAdmin } from './calendar-admin';


const navButton = cn(
  'flex h-11 w-11 items-center justify-center rounded-xl',
  'bg-white/5 border border-white/10 text-white/70',
  'hover:bg-white/10 hover:text-white transition-colors',
);

const NO_ITEMS: CalendarItem[] = [];

/**
 * 월간 캘린더.
 * - 날짜를 누르면 그 날짜로 일정 추가(관리자 키를 그때 묻는다)
 * - 칸 안의 일정을 누르면 상세(PC 모달 / 모바일 페이지)
 * - 월 이동은 누르는 즉시 새 달의 달력을 그리고, 일정은 서버 응답이 오면 채운다
 */
export function CalendarView({
  year,
  month,
  items,
}: {
  year: number;
  month: number;
  items: CalendarItem[];
}) {
  const admin = useCalendarAdmin();

  // 이동 중인 달. 새 페이지가 도착하면 이 컴포넌트가 key로 새로 마운트되며 초기화된다.
  const [pendingMonth, setPendingMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const shown = pendingMonth ?? { year, month };
  const shownItems = pendingMonth ? NO_ITEMS : items;
  const prev = shiftMonth(shown.year, shown.month, -1);
  const next = shiftMonth(shown.year, shown.month, 1);

  const weeks = useMemo(
    () => buildMonthGrid(shown.year, shown.month),
    [shown.year, shown.month],
  );

  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of shownItems) {
      const key = toKstDateKey(item.startsAt);
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return map;
  }, [shownItems]);

  // ISR HTML과 어긋나지 않도록 '오늘'은 마운트 후에 계산
  const [todayKey, setTodayKey] = useState<string | null>(null);
  useEffect(() => {
    setTodayKey(todayKstKey());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/calendar/${formatMonthParam(prev.year, prev.month)}`}
          scroll={false}
          onClick={() => {
            setPendingMonth(prev);
          }}
          className={navButton}
          aria-label="이전 달"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tabular-nums">
          {shown.year}년 {shown.month}월
          {pendingMonth && (
            <Loader2
              className="h-4 w-4 animate-spin text-white/40"
              aria-label="일정을 불러오는 중"
            />
          )}
        </h2>
        <Link
          href={`/calendar/${formatMonthParam(next.year, next.month)}`}
          scroll={false}
          onClick={() => {
            setPendingMonth(next);
          }}
          className={navButton}
          aria-label="다음 달"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAY_LABELS.map((day, i) => (
            <div
              key={day}
              className={cn(
                'py-2 text-center text-xs font-medium',
                i === 0 ? 'text-rose-400' : i === 6 ? 'text-sky-400' : 'text-white/50',
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((dateKey, di) => {
              if (!dateKey) {
                return (
                  <div
                    key={`empty-${wi}-${di}`}
                    className="min-h-20 md:min-h-28 border-b border-r border-white/5 last:border-r-0"
                  />
                );
              }
              const dayItems = itemsByDate.get(dateKey) ?? [];
              const isToday = dateKey === todayKey;
              const day = Number(dateKey.slice(8));

              return (
                <div
                  key={dateKey}
                  className="relative min-h-20 md:min-h-28 min-w-0 border-b border-r border-white/5 last:border-r-0"
                >
                  {/* 칸 전체: 이 날짜로 일정 추가 */}
                  <button
                    type="button"
                    onClick={() => {
                      admin.openCreate(dateKey);
                    }}
                    aria-label={`${shown.month}월 ${day}일에 일정 추가`}
                    className="absolute inset-0 cursor-pointer transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:outline-none"
                  />

                  {/* 칸 위의 내용. 일정 칩만 클릭을 받고 나머지는 아래 버튼으로 통과시킨다 */}
                  <div className="pointer-events-none relative flex flex-col items-stretch gap-1 p-1 md:p-2">
                    <span
                      className={cn(
                        'mx-auto md:mx-0 flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-xs md:text-sm tabular-nums',
                        di === 0 ? 'text-rose-400' : di === 6 ? 'text-sky-400' : 'text-white/80',
                        isToday && 'bg-red-600 text-white font-semibold',
                      )}
                    >
                      {day}
                    </span>

                    {dayItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/calendar/event/${item.id}`}
                        scroll={false}
                        className={cn(
                          'pointer-events-auto block truncate rounded md:rounded-md',
                          'px-1 md:px-1.5 py-0.5 text-[10px] md:text-[11px] font-medium leading-4',
                          'transition-opacity hover:opacity-80',
                          itemColors(item).chip,
                        )}
                      >
                        {/* 모바일은 칸이 좁아 경기는 상대팀 이름만 */}
                        <span className="md:hidden">
                          {item.kind === 'game' ? item.opponent : item.title}
                        </span>
                        <span className="hidden md:inline">
                          {item.kind === 'game' && item.result
                            ? `${item.result} ${item.title}`
                            : item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
