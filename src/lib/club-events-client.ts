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
  /** type === 'game' 전용 */
  opponent: string;
  ourScore: string;
  theirScore: string;
}

export interface ClubEventPayload {
  title: string;
  type: ClubEventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string;
  description: string;
  opponent: string | null;
  our_score: number | null;
  their_score: number | null;
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
    opponent: '',
    ourScore: '',
    theirScore: '',
  };
}

export function clubEventToForm(event: ClubEvent): ClubEventFormState {
  return {
    title: event.type === 'game' ? '' : event.title,
    type: event.type,
    date: toKstDateKey(event.starts_at),
    startTime: event.all_day ? '' : toKstTime(event.starts_at),
    endTime: event.ends_at && !event.all_day ? toKstTime(event.ends_at) : '',
    allDay: event.all_day,
    location: event.location ?? '',
    description: event.description ?? '',
    opponent: event.opponent ?? '',
    ourScore: event.our_score?.toString() ?? '',
    theirScore: event.their_score?.toString() ?? '',
  };
}

function toKstIso(date: string, time: string) {
  return `${date}T${time || '00:00'}:00+09:00`;
}

function parseScore(value: string): number | null | 'invalid' {
  if (!value.trim()) return null;
  return /^\d{1,3}$/.test(value.trim()) ? Number(value) : 'invalid';
}

/** 폼 → API payload. 클라이언트 검증 실패 시 error 메시지 */
export function clubEventFormToPayload(
  form: ClubEventFormState,
): { payload: ClubEventPayload } | { error: string } {
  const isGame = form.type === 'game';
  if (isGame && !form.opponent.trim()) return { error: '상대팀을 입력하세요.' };
  if (!isGame && !form.title.trim()) return { error: '제목을 입력하세요.' };
  if (!form.date) return { error: '날짜를 선택하세요.' };

  const allDay = isGame ? false : form.allDay;
  if (!allDay && !form.startTime) {
    return {
      error: isGame
        ? '경기 시작 시간을 입력하세요.'
        : '시작 시간을 입력하거나 종일을 선택하세요.',
    };
  }
  if (!allDay && form.endTime && form.endTime < form.startTime) {
    return { error: '종료 시간이 시작 시간보다 빠릅니다.' };
  }

  const ours = isGame ? parseScore(form.ourScore) : null;
  const theirs = isGame ? parseScore(form.theirScore) : null;
  if (ours === 'invalid' || theirs === 'invalid') {
    return { error: '점수는 0 이상의 숫자로 입력하세요.' };
  }
  if ((ours === null) !== (theirs === null)) {
    return { error: '점수는 양 팀 모두 입력하거나 모두 비워 두세요.' };
  }

  return {
    payload: {
      title: isGame ? `vs ${form.opponent.trim()}` : form.title,
      type: form.type,
      starts_at: toKstIso(form.date, allDay ? '' : form.startTime),
      ends_at: !allDay && form.endTime ? toKstIso(form.date, form.endTime) : null,
      all_day: allDay,
      location: form.location,
      description: form.description,
      opponent: isGame ? form.opponent.trim() : null,
      our_score: ours,
      their_score: theirs,
    },
  };
}
