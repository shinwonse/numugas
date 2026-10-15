'use client';

import { buildMonthGrid, toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import { itemColors, itemLabel, RESULT_STYLES } from '@/lib/calendar-styles';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { ExternalLink, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

  return (
    <div className="space-y-6">
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
                    'transition-colors hover:bg-white/[0.06]',
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
        {selected && (
          <h3 className="mb-3 text-sm font-medium text-white/60">
            {month}월 {Number(selected.slice(8))}일 (
            {WEEKDAYS[new Date(`${selected}T00:00:00Z`).getUTCDay()]})
          </h3>
        )}
        {selectedItems.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/40">
            {selected
              ? '일정이 없습니다'
              : items.length === 0
                ? '이번 달 일정이 없습니다'
                : '날짜를 선택하세요'}
          </p>
        ) : (
          <ul className="space-y-3">
            {selectedItems.map((item) => (
              <CalendarItemCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CalendarItemCard({ item }: { item: CalendarItem }) {
  const label = itemLabel(item);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="w-12 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-white/70">
          {itemTime(item)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn('rounded-md px-1.5 py-0.5 text-[11px] font-medium', itemColors(item).chip)}
            >
              {label}
            </span>
            <span className="font-semibold">{item.title}</span>
            {item.kind === 'game' && item.result && item.score && (
              <span
                className={cn(
                  'rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums',
                  RESULT_STYLES[item.result],
                )}
              >
                {item.result} {item.score.ours}:{item.score.theirs}
              </span>
            )}
          </div>

          {item.kind === 'game' && item.category && (
            <p className="mt-1 text-xs text-white/40">{item.category}</p>
          )}
          {item.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
              <MapPin className="h-3 w-3" />
              {item.location}
            </p>
          )}
          {item.kind === 'event' && item.description && (
            <p className="mt-2 whitespace-pre-line text-sm text-white/60">
              {item.description}
            </p>
          )}
          {item.kind === 'game' && item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              박스스코어
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
