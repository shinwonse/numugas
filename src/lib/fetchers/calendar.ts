import { getGameOutcome, getMonthRange } from '@/lib/calendar-utils';
import { supabase } from '@/lib/supabase';
import type { CalendarItem, ClubEvent } from '@/types/calendar';

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
      .select(
        'id, game_at, category, stadium, team1_name, team1_score, team2_name, team2_score, result_link',
      )
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

  const games: CalendarItem[] = gamesRes.data.map((game) => {
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
  });

  const events: CalendarItem[] = (eventsRes.data as ClubEvent[]).map(
    (event) => ({
      kind: 'event',
      id: `event-${event.id}`,
      startsAt: event.starts_at,
      endsAt: event.ends_at,
      allDay: event.all_day,
      title: event.title,
      eventType: event.type,
      location: event.location,
      description: event.description,
    }),
  );

  return [...games, ...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}
