import { toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import type { ClubEvent, ClubEventType } from '@/types/calendar';

/** 구단 일정 폼 상태 (날짜/시간은 KST 기준 문자열) */
export interface ClubEventFormState {
  title: string;
  type: ClubEventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm, optional
  allDay: boolean;
  location: string;
  description: string;
}

export interface ClubEventPayload {
  title: string;
  type: ClubEventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string;
  description: string;
}

export function emptyClubEventForm(date = ''): ClubEventFormState {
  return {
    title: '',
    type: 'training',
    date,
    startTime: '',
    endTime: '',
    allDay: false,
    location: '',
    description: '',
  };
}

export function clubEventToForm(
  event: Pick<
    ClubEvent,
    'title' | 'type' | 'starts_at' | 'ends_at' | 'all_day' | 'location' | 'description'
  >,
): ClubEventFormState {
  return {
    title: event.title,
    type: event.type,
    date: toKstDateKey(event.starts_at),
    startTime: event.all_day ? '' : toKstTime(event.starts_at),
    endTime: event.ends_at && !event.all_day ? toKstTime(event.ends_at) : '',
    allDay: event.all_day,
    location: event.location ?? '',
    description: event.description ?? '',
  };
}

function toKstIso(date: string, time: string) {
  return `${date}T${time || '00:00'}:00+09:00`;
}

/** 폼 → API payload. 클라이언트 검증 실패 시 error 메시지 */
export function clubEventFormToPayload(
  form: ClubEventFormState,
): { payload: ClubEventPayload } | { error: string } {
  if (!form.title.trim()) return { error: '제목을 입력하세요.' };
  if (!form.date) return { error: '날짜를 선택하세요.' };
  if (!form.allDay && !form.startTime) {
    return { error: '시작 시간을 입력하거나 종일을 선택하세요.' };
  }
  if (!form.allDay && form.endTime && form.endTime < form.startTime) {
    return { error: '종료 시간이 시작 시간보다 빠릅니다.' };
  }
  return {
    payload: {
      title: form.title,
      type: form.type,
      starts_at: toKstIso(form.date, form.allDay ? '' : form.startTime),
      ends_at:
        !form.allDay && form.endTime ? toKstIso(form.date, form.endTime) : null,
      all_day: form.allDay,
      location: form.location,
      description: form.description,
    },
  };
}

export class AdminRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** /api/admin/events 호출. 실패 시 AdminRequestError(status 포함) */
export async function requestClubEvent(
  secret: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body: { id?: string; event?: ClubEventPayload },
) {
  const res = await fetch('/api/admin/events', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, ...body }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new AdminRequestError(data.error ?? `HTTP ${res.status}`, res.status);
  }
}
