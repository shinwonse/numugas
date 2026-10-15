// 서버 전용 (Server Action에서만 import)
import { CLUB_EVENT_TYPES, type ClubEventType } from '@/types/calendar';

export function isAdminSecret(secret: string | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;
  return Boolean(expected) && secret === expected;
}

export interface ClubEventInput {
  title?: string;
  type?: string;
  starts_at?: string;
  ends_at?: string | null;
  all_day?: boolean;
  location?: string | null;
  description?: string | null;
}

export interface ValidClubEvent {
  title: string;
  type: ClubEventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string | null;
  description: string | null;
}

export function validateClubEvent(
  input: ClubEventInput | undefined,
): { error: string } | { value: ValidClubEvent } {
  if (!input) return { error: '일정 정보가 없습니다.' }
  const title = input.title?.trim();
  if (!title) return { error: '제목을 입력하세요.' }
  if (!CLUB_EVENT_TYPES.includes(input.type as ClubEventType)) {
    return { error: '일정 종류가 올바르지 않습니다.' }
  }
  const startsAt = input.starts_at ? new Date(input.starts_at) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return { error: '시작 일시가 올바르지 않습니다.' }
  }
  const endsAt = input.ends_at ? new Date(input.ends_at) : null;
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt < startsAt)) {
    return { error: '종료 일시가 시작 일시보다 빠릅니다.' }
  }

  return {
    value: {
      title,
      type: input.type as ClubEventType,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt ? endsAt.toISOString() : null,
      all_day: Boolean(input.all_day),
      location: input.location?.trim() || null,
      description: input.description?.trim() || null,
    },
  }
}
