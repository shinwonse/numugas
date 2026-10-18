'use client';

import { buildMonthGrid, toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import { itemColors, itemLabel, RESULT_STYLES } from '@/lib/calendar-styles';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCalendarAdmin } from './calendar-admin';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function itemTime(item: CalendarItem) {
  return item.kind === 'event' && item.allDay ? '종일' : toKstTime(item.startsAt);
}

export function CalendarView({
  year,
  month,
  items,
}: {
  year: number;
  month: number;
  items: CalendarItem[];
}) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of items) {
      const key = toKstDateKey(item.startsAt);
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return map;
  }, [items]);

  // ISR HTML과 어긋나지 않도록 '오늘'은 마운트 후에 계산
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(() =>
    items[0] ? toKstDateKey(items[0].startsAt) : null,
  );

  useEffect(() => {
    const today = toKstDateKey(new Date().toISOString());
    setTodayKey(today);
    if (weeks.flat().includes(today)) setSelected(today);
  }, [weeks]);

  const selectedItems = selected ? (itemsByDate.get(selected) ?? []) : [];
  const admin = useCalendarAdmin();

  return (
    <div className="space-y-6">
      {admin.isAdmin && (
        <div className="-mt-2 flex items-center justify-end gap-2">
          <span className="mr-auto rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-300">
            관리 모드
          </span>
          <button
            type="button"
            onClick={admin.lock}
            className="cursor-pointer rounded-xl px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            관리 종료
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAYS.map((day, i) => (
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
                    className="min-h-14 md:min-h-28 border-b border-r border-white/5 last:border-r-0"
                  />
                );
              }
              const dayItems = itemsByDate.get(dateKey) ?? [];
              const isSelected = dateKey === selected;
              const isToday = dateKey === todayKey;
              const day = Number(dateKey.slice(8));

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelected(dateKey)}
                  aria-pressed={isSelected}
                  aria-label={`${month}월 ${day}일, 일정 ${dayItems.length}개`}
                  className={cn(
                    'min-h-14 md:min-h-28 p-1 md:p-2 text-left',
                    'flex flex-col items-center md:items-stretch gap-1',
                    'border-b border-r border-white/5 last:border-r-0',
                    'cursor-pointer transition-colors hover:bg-white/[0.06]',
                    isSelected && 'bg-white/[0.08]',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-sm tabular-nums',
                      di === 0 ? 'text-rose-400' : di === 6 ? 'text-sky-400' : 'text-white/80',
                      isToday && 'bg-red-600 text-white font-semibold',
                    )}
                  >
                    {day}
                  </span>

                  {/* 모바일: 점 */}
                  {dayItems.length > 0 && (
                    <span className="flex gap-0.5 md:hidden">
                      {dayItems.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className={cn('h-1.5 w-1.5 rounded-full', itemColors(item).dot)}
                        />
                      ))}
                    </span>
                  )}

                  {/* 데스크톱: 칩 */}
                  <span className="hidden md:flex flex-col gap-1 w-full">
                    {dayItems.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className={cn(
                          'truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium',
                          itemColors(item).chip,
                        )}
                      >
                        {item.kind === 'game' && item.result
                          ? `${item.result} ${item.title}`
                          : item.title}
                      </span>
                    ))}
                    {dayItems.length > 3 && (
                      <span className="px-1.5 text-[11px] text-white/40">
                        +{dayItems.length - 3}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <section aria-live="polite">
        {selected ? (
          <>
            <div className="mb-3 flex min-h-11 items-center justify-between gap-2">
              <h3 className="text-sm font-medium text-white/60">
                {month}월 {Number(selected.slice(8))}일 (
                {WEEKDAYS[new Date(`${selected}T00:00:00Z`).getUTCDay()]})
              </h3>
              <button
                type="button"
                onClick={() => {
                  admin.openCreate(selected);
                }}
                className="flex min-h-11 cursor-pointer items-center gap-1 rounded-xl px-3 text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
              >
                <Plus className="h-4 w-4" />
                일정 추가
              </button>
            </div>
            {selectedItems.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/40">
                일정이 없습니다
              </p>
            ) : (
              <ul className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl divide-y divide-white/5">
                {selectedItems.map((item) => (
                  <li key={item.id}>
                    <CalendarItemRow item={item} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/40">
            {items.length === 0 ? '이번 달 일정이 없습니다' : '날짜를 선택하세요'}
          </p>
        )}
      </section>
    </div>
  );
}

/** 선택한 날짜의 일정 한 줄. 누르면 상세(PC 모달 / 모바일 페이지)로 이동한다. */
function CalendarItemRow({ item }: { item: CalendarItem }) {
  return (
    <Link
      href={`/calendar/event/${item.id}`}
      scroll={false}
      className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.05]"
    >
      <span className="w-10 shrink-0 text-sm font-semibold tabular-nums text-white/70">
        {itemTime(item)}
      </span>
      <span
        className={cn(
          'shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
          itemColors(item).chip,
        )}
      >
        {itemLabel(item)}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
      {item.kind === 'game' && item.result && item.score && (
        <span
          className={cn(
            'shrink-0 rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums',
            RESULT_STYLES[item.result],
          )}
        >
          {item.result} {item.score.ours}:{item.score.theirs}
        </span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden />
    </Link>
  );
}
