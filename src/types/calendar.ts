import type { GameResult } from '@/lib/calendar-utils';

export const CLUB_EVENT_TYPES = ['training', 'dinner', 'event', 'etc'] as const;
export type ClubEventType = (typeof CLUB_EVENT_TYPES)[number];

export const CLUB_EVENT_TYPE_LABELS: Record<ClubEventType, string> = {
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
    }
  | {
      kind: 'event';
      id: string;
      startsAt: string;
      endsAt: string | null;
      allDay: boolean;
      title: string;
      eventType: ClubEventType;
      location: string | null;
      description: string | null;
    };
