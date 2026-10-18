import type { GameResult } from '@/lib/calendar-utils';
import type { CalendarItem } from '@/types/calendar';
import { cache } from 'react';
import { fetchAllGames } from './calendar';

export interface HeadToHeadGame {
  /** CalendarItem.id (`game-<번호>` / `event-<uuid>`) */
  id: string;
  startsAt: string;
  category: string;
  ours: number;
  theirs: number;
  result: GameResult;
}

export interface OpponentRecord {
  opponent: string;
  games: number;
  win: number;
  lose: number;
  draw: number;
  runsFor: number;
  runsAgainst: number;
  /** 최근 경기부터 */
  matches: HeadToHeadGame[];
}

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ');

/**
 * 끝난 경기(점수 있음)를 상대팀별로 묶은 전적.
 * 많이 만난 순, 같으면 최근에 만난 순. 실패 시 throw.
 * 한 요청 안에서 여러 번 불려도 조회는 한 번만 한다.
 */
export const fetchOpponentRecords = cache(
  async (): Promise<OpponentRecord[]> => {
    const games = await fetchAllGames();
    const byOpponent = new Map<string, OpponentRecord>();

    for (const game of games) {
      if (!game.score || !game.result) continue;
      const opponent = normalizeName(game.opponent);
      if (!opponent) continue;

      let record = byOpponent.get(opponent);
      if (!record) {
        record = {
          opponent,
          games: 0,
          win: 0,
          lose: 0,
          draw: 0,
          runsFor: 0,
          runsAgainst: 0,
          matches: [],
        };
        byOpponent.set(opponent, record);
      }

      record.games += 1;
      if (game.result === '승') record.win += 1;
      else if (game.result === '패') record.lose += 1;
      else record.draw += 1;
      record.runsFor += game.score.ours;
      record.runsAgainst += game.score.theirs;
      record.matches.push({
        id: game.id,
        startsAt: game.startsAt,
        category: game.category,
        ours: game.score.ours,
        theirs: game.score.theirs,
        result: game.result,
      });
    }

    const records = [...byOpponent.values()];
    for (const record of records) record.matches.reverse();

    return records.sort(
      (a, b) =>
        b.games - a.games ||
        new Date(b.matches[0].startsAt).getTime() -
          new Date(a.matches[0].startsAt).getTime(),
    );
  },
);

/** 특정 상대와의 전적. 맞대결이 없으면 null. */
export async function fetchOpponentRecord(
  opponent: string,
): Promise<OpponentRecord | null> {
  const name = normalizeName(opponent);
  if (!name) return null;
  const records = await fetchOpponentRecords();
  return records.find((r) => r.opponent === name) ?? null;
}

/**
 * 경기 상세에 붙이는 상대 전적 요약. 경기가 아니거나 맞대결이 없으면 null.
 * 부가 정보라 조회 실패는 로그만 남기고 null로 흡수한다(상세 화면은 그대로 보인다).
 */
export async function fetchHeadToHeadSummary(item: CalendarItem) {
  if (item.kind !== 'game') return null;
  try {
    const record = await fetchOpponentRecord(item.opponent);
    if (!record) return null;
    const { opponent, games, win, lose, draw } = record;
    return { opponent, games, win, lose, draw };
  } catch (e) {
    console.error(`[calendar] 상대 전적 조회 실패 (${item.opponent})`, e);
    return null;
  }
}
