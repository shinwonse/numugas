import { cache } from 'react';
import { fetchAllGames } from './calendar';

export interface TeamGameRecords {
  /** 점수가 있는 경기 수 */
  games: number;
  runsFor: number;
  runsAgainst: number;
  /** 최다 연승 (무승부는 연승을 끊지도 잇지도 않는다) */
  longestWinStreak: number;
}

/**
 * 경기 결과(점수)로 계산한 팀 기록. 실패 시 throw.
 * 한 요청 안에서 여러 번 불려도 조회는 한 번만 한다.
 */
export const fetchTeamGameRecords = cache(async (): Promise<TeamGameRecords> => {
  // 시작 시각 오름차순
  const games = await fetchAllGames();

  const records: TeamGameRecords = {
    games: 0,
    runsFor: 0,
    runsAgainst: 0,
    longestWinStreak: 0,
  };
  let streak = 0;

  for (const game of games) {
    if (!game.score || !game.result) continue;
    const { ours, theirs } = game.score;

    records.games += 1;
    records.runsFor += ours;
    records.runsAgainst += theirs;

    if (game.result === '승') {
      streak += 1;
      records.longestWinStreak = Math.max(records.longestWinStreak, streak);
    } else if (game.result === '패') {
      streak = 0;
    }
  }

  return records;
});
