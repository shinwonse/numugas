import { getGameOutcome, getMonthRange } from '@/lib/calendar-utils';
import { supabase } from '@/lib/supabase';
import type { CalendarItem, ClubEvent } from '@/types/calendar';

const GAME_COLUMNS =
  'id, game_at, category, stadium, team1_name, team1_score, team2_name, team2_score, result_link';

interface GameRow {
  id: number;
  game_at: string;
  category: string;
  stadium: string;
  team1_name: string;
  team1_score: string;
  team2_name: string;
  team2_score: string;
  result_link: string | null;
}

function gameToItem(game: GameRow): CalendarItem {
  const { opponent, score, result } = getGameOutcome(game);
  return {
    kind: 'game',
    id: `game-${game.id}`,
    startsAt: game.game_at,
    title: `vs ${opponent}`,
    category: game.category,
    location: game.stadium || null,
    opponent,
    score,
    result,
    // 경기 전에는 BOX SCORE 링크가 의미 없다
    link: result ? game.result_link : null,
  };
}

function eventToItem(event: ClubEvent): CalendarItem {
  return {
    kind: 'event',
    id: `event-${event.id}`,
    startsAt: event.starts_at,
    endsAt: event.ends_at,
    allDay: event.all_day,
    title: event.title,
    eventType: event.type,
    location: event.location,
    description: event.description,
  };
}

function byStartsAt(a: CalendarItem, b: CalendarItem) {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
}

/**
 * 해당 월(KST)의 경기 일정 + 구단 일정을 시간순으로 합쳐 반환.
 * 실패 시 throw — 빈 결과가 ISR 캐시에 남지 않도록 한다.
 */
export async function fetchCalendarMonth(
  year: number,
  month: number,
): Promise<CalendarItem[]> {
  const { start, end } = getMonthRange(year, month);

  const [gamesRes, eventsRes] = await Promise.all([
    supabase
      .from('schedule')
      .select(GAME_COLUMNS)
      .gte('game_at', start)
      .lt('game_at', end),
    supabase
      .from('club_events')
      .select('*')
      .gte('starts_at', start)
      .lt('starts_at', end),
  ]);

  if (gamesRes.error) throw gamesRes.error;
  if (eventsRes.error) throw eventsRes.error;

  return [
    ...(gamesRes.data as GameRow[]).map(gameToItem),
    ...(eventsRes.data as ClubEvent[]).map(eventToItem),
  ].sort(byStartsAt);
}

/**
 * 렌더 시점 기준 하루 전 이후의 일정을 넉넉히(limit개씩) 가져온다.
 * 홈은 on-demand 재검증이라 오래 캐시될 수 있으므로, 지난 일정은
 * 클라이언트에서 isUpcoming으로 걸러낸다. 실패 시 throw.
 */
export async function fetchUpcomingItems(limit = 10): Promise<CalendarItem[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [gamesRes, eventsRes] = await Promise.all([
    supabase
      .from('schedule')
      .select(GAME_COLUMNS)
      .gte('game_at', since)
      .order('game_at', { ascending: true })
      .limit(limit),
    supabase
      .from('club_events')
      .select('*')
      .gte('starts_at', since)
      .order('starts_at', { ascending: true })
      .limit(limit),
  ]);

  if (gamesRes.error) throw gamesRes.error;
  if (eventsRes.error) throw eventsRes.error;

  return [
    ...(gamesRes.data as GameRow[]).map(gameToItem),
    ...(eventsRes.data as ClubEvent[]).map(eventToItem),
  ]
    .sort(byStartsAt)
    .slice(0, limit);
}
