import type { CalendarItem, ClubEventType } from '@/types/calendar';
import { CLUB_EVENT_TYPE_LABELS } from '@/types/calendar';

const EVENT_COLORS: Record<ClubEventType, { dot: string; chip: string }> = {
  training: { dot: 'bg-sky-400', chip: 'bg-sky-500/15 text-sky-300' },
  dinner: { dot: 'bg-amber-400', chip: 'bg-amber-500/15 text-amber-300' },
  event: { dot: 'bg-violet-400', chip: 'bg-violet-500/15 text-violet-300' },
  etc: { dot: 'bg-gray-400', chip: 'bg-white/10 text-gray-300' },
};

const GAME_COLORS = { dot: 'bg-red-500', chip: 'bg-red-500/15 text-red-300' };

export const RESULT_STYLES = {
  승: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  패: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  무: 'bg-white/10 text-gray-300 border-white/20',
} as const;

export function itemColors(item: CalendarItem) {
  return item.kind === 'game' ? GAME_COLORS : EVENT_COLORS[item.eventType];
}

export function itemLabel(item: CalendarItem) {
  return item.kind === 'game' ? '경기' : CLUB_EVENT_TYPE_LABELS[item.eventType];
}
