'use client';

import { itemColors, itemLabel, RESULT_STYLES } from '@/lib/calendar-styles';
import { toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { CalendarDays, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCalendarAdmin } from './calendar-admin';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDay(iso: string) {
  const key = toKstDateKey(iso);
  const [y, m, d] = key.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(`${key}T00:00:00Z`).getUTCDay()];
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

/** "2026년 10월 18일 (토) 14:00 – 16:00" / 종일 / 여러 날 일정 */
function formatWhen(item: CalendarItem) {
  const start = formatDay(item.startsAt);
  if (item.kind === 'event' && item.allDay) {
    if (item.endsAt && toKstDateKey(item.endsAt) !== toKstDateKey(item.startsAt)) {
      return `${start} – ${formatDay(item.endsAt)}`;
    }
    return `${start} 종일`;
  }
  const time = toKstTime(item.startsAt);
  if (item.kind === 'event' && item.endsAt) {
    const sameDay = toKstDateKey(item.endsAt) === toKstDateKey(item.startsAt);
    return sameDay
      ? `${start} ${time} – ${toKstTime(item.endsAt)}`
      : `${start} ${time} – ${formatDay(item.endsAt)} ${toKstTime(item.endsAt)}`;
  }
  return `${start} ${time}`;
}

/**
 * 일정 상세. PC 모달과 모바일 페이지에서 함께 쓴다.
 * 직접 등록한 일정이면 수정/삭제 버튼이 보이고, 누를 때 관리자 키를 묻는다.
 */
export function EventDetail({
  item,
  deletedHref,
}: {
  item: CalendarItem;
  /** 삭제 후 이동할 경로. 없으면 이전 화면(모달을 연 캘린더)으로 돌아간다. */
  deletedHref?: string;
}) {
  const admin = useCalendarAdmin();
  const router = useRouter();
  const record = item.record;

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              itemColors(item).chip,
            )}
          >
            {itemLabel(item)}
          </span>
          {item.kind === 'game' && item.category && (
            <span className="text-xs text-white/40">{item.category}</span>
          )}
        </div>
        <h2 className="text-2xl font-bold leading-snug">{item.title}</h2>
        {item.kind === 'game' && item.result && item.score && (
          <p
            className={cn(
              'inline-flex rounded-lg border px-2.5 py-1 text-sm font-semibold tabular-nums',
              RESULT_STYLES[item.result],
            )}
          >
            {item.result} {item.score.ours}:{item.score.theirs}
          </p>
        )}
      </header>

      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <dt className="sr-only">일시</dt>
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden />
          <dd className="text-white/80">{formatWhen(item)}</dd>
        </div>
        {item.location && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">장소</dt>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden />
            <dd className="text-white/80">{item.location}</dd>
          </div>
        )}
      </dl>

      {item.description && (
        <p className="whitespace-pre-line rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/70">
          {item.description}
        </p>
      )}

      {item.kind === 'game' && item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-red-400 transition-colors hover:text-red-300"
        >
          박스스코어
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {record && (
        <div className="flex gap-2 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => {
              admin.openEdit(record);
            }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            수정
          </button>
          <button
            type="button"
            onClick={() => {
              admin.openDelete(record, () => {
                if (deletedHref) router.replace(deletedHref);
                else router.back();
              });
            }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </button>
        </div>
      )}
    </article>
  );
}
