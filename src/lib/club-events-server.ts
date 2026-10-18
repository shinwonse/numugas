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
  opponent?: string | null;
  our_score?: number | null;
  their_score?: number | null;
}

export interface ValidClubEvent {
  title: string;
  type: ClubEventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string | null;
  description: string | null;
  opponent: string | null;
  our_score: number | null;
  their_score: number | null;
}

function isScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 999;
}

export function validateClubEvent(
  input: ClubEventInput | undefined,
): { error: string } | { value: ValidClubEvent } {
  if (!input) return { error: '일정 정보가 없습니다.' };
  if (!CLUB_EVENT_TYPES.includes(input.type as ClubEventType)) {
    return { error: '일정 종류가 올바르지 않습니다.' };
  }
  const type = input.type as ClubEventType;
  const isGame = type === 'game';

  const opponent = isGame ? input.opponent?.trim() || null : null;
  if (isGame && !opponent) return { error: '상대팀을 입력하세요.' };
  // 경기 제목은 상대팀으로 만든다
  const title = isGame ? `vs ${opponent}` : input.title?.trim();
  if (!title) return { error: '제목을 입력하세요.' };

  const hasOurs = input.our_score !== null && input.our_score !== undefined;
  const hasTheirs = input.their_score !== null && input.their_score !== undefined;
  if (isGame && hasOurs !== hasTheirs) {
    return { error: '점수는 양 팀 모두 입력하거나 모두 비워 두세요.' };
  }
  if (isGame && hasOurs && (!isScore(input.our_score) || !isScore(input.their_score))) {
    return { error: '점수가 올바르지 않습니다.' };
  }

  const startsAt = input.starts_at ? new Date(input.starts_at) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return { error: '시작 일시가 올바르지 않습니다.' };
  }
  const endsAt = input.ends_at ? new Date(input.ends_at) : null;
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt < startsAt)) {
    return { error: '종료 일시가 시작 일시보다 빠릅니다.' };
  }

  return {
    value: {
      title,
      type,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt ? endsAt.toISOString() : null,
      // 경기는 시간이 있어야 한다
      all_day: isGame ? false : Boolean(input.all_day),
      location: input.location?.trim() || null,
      description: input.description?.trim() || null,
      opponent,
      our_score: isGame && hasOurs ? (input.our_score as number) : null,
      their_score: isGame && hasOurs ? (input.their_score as number) : null,
    },
  };
}
