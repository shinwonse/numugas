import {
  getGameOutcome,
  getMonthRange,
  resultFromScore,
} from '@/lib/calendar-utils';
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
    description: null,
  };
}

function eventToItem(event: ClubEvent): CalendarItem {
  // 직접 등록한 경기는 크롤링된 경기와 같은 모양으로 보여준다
  if (event.type === 'game') {
    const opponent = event.opponent ?? '';
    const score =
      event.our_score !== null && event.their_score !== null
        ? { ours: event.our_score, theirs: event.their_score }
        : null;
    return {
      kind: 'game',
      id: `event-${event.id}`,
      startsAt: event.starts_at,
      title: `vs ${opponent}`,
      category: '',
      location: event.location,
      opponent,
      score,
      result: score ? resultFromScore(score.ours, score.theirs) : null,
      link: null,
      description: event.description,
      record: event,
    };
  }
  return {
    kind: 'event',
    id: `event-${event.id}`,
    record: event,
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

export type GameItem = Extract<CalendarItem, { kind: 'game' }>;

/**
 * 전체 기간의 경기(크롤링 경기 + 직접 등록한 경기)를 시간순으로 반환.
 * 실패 시 throw.
 */
export async function fetchAllGames(): Promise<GameItem[]> {
  const [gamesRes, eventsRes] = await Promise.all([
    supabase.from('schedule').select(GAME_COLUMNS),
    supabase.from('club_events').select('*').eq('type', 'game'),
  ]);

  if (gamesRes.error) throw gamesRes.error;
  if (eventsRes.error) throw eventsRes.error;

  return [
    ...(gamesRes.data as GameRow[]).map(gameToItem),
    ...(eventsRes.data as ClubEvent[]).map(eventToItem),
  ]
    .filter((item): item is GameItem => item.kind === 'game')
    .sort(byStartsAt);
}

/**
 * 캘린더 항목 하나 조회. id는 CalendarItem.id 형식(`game-<번호>` / `event-<uuid>`).
 * 없으면 null, 조회 실패 시 throw.
 */
export async function fetchCalendarItem(
  id: string,
): Promise<CalendarItem | null> {
  const gameId = /^game-(\d+)$/.exec(id)?.[1];
  if (gameId) {
    const { data, error } = await supabase
      .from('schedule')
      .select(GAME_COLUMNS)
      .eq('id', Number(gameId))
      .maybeSingle();
    if (error) throw error;
    return data ? gameToItem(data as GameRow) : null;
  }

  const eventId = /^event-([0-9a-f-]{36})$/i.exec(id)?.[1];
  if (eventId) {
    const { data, error } = await supabase
      .from('club_events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();
    if (error) throw error;
    return data ? eventToItem(data as ClubEvent) : null;
  }

  return null;
}
