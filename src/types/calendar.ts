import type { GameResult } from '@/lib/calendar-utils';

export const CLUB_EVENT_TYPES = [
  'game',
  'training',
  'dinner',
  'event',
  'etc',
] as const;
export type ClubEventType = (typeof CLUB_EVENT_TYPES)[number];

/** 경기 외 일정 종류 (캘린더에서 'event'로 표시) */
export type ClubScheduleType = Exclude<ClubEventType, 'game'>;

export const CLUB_EVENT_TYPE_LABELS: Record<ClubEventType, string> = {
  game: '경기',
  training: '훈련',
  dinner: '회식',
  event: '행사',
  etc: '기타',
};

export interface ClubEvent {
  id: string;
  title: string;
  type: ClubEventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location: string | null;
  description: string | null;
  /** type === 'game'일 때만 사용 */
  opponent: string | null;
  our_score: number | null;
  their_score: number | null;
}

export type CalendarItem =
  | {
      kind: 'game';
      id: string;
      startsAt: string;
      title: string;
      category: string;
      location: string | null;
      opponent: string;
      score: { ours: number; theirs: number } | null;
      result: GameResult | null;
      link: string | null;
      description: string | null;
      /** 캘린더에서 직접 등록한 경기면 원본 레코드 (수정/삭제용) */
      record?: ClubEvent;
    }
  | {
      kind: 'event';
      id: string;
      /** 원본 레코드 (수정/삭제용) */
      record: ClubEvent;
      startsAt: string;
      endsAt: string | null;
      allDay: boolean;
      title: string;
      eventType: ClubScheduleType;
      location: string | null;
      description: string | null;
    };
