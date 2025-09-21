import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PlayerWithValue {
  value: number;
  [key: string]: any;
}

/**
 * 공동 기록을 고려한 순위 계산
 * @param players 이미 value 기준으로 정렬된 선수 배열
 * @returns 순위가 포함된 선수 배열 (최대 3명)
 */
export function calculateRankingsWithTies<T extends PlayerWithValue>(
  players: T[],
): (T & { rank: number })[] {
  if (players.length === 0) return [];

  const playersWithRank: (T & { rank: number })[] = [];
  let currentRank = 1;
  let previousValue: number | null = null;
  let playersAtCurrentRank = 0;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    // 이전 값과 다르면 새로운 순위로 이동
    if (previousValue !== null && player.value !== previousValue) {
      currentRank += playersAtCurrentRank;
      playersAtCurrentRank = 0;
    }

    playersAtCurrentRank++;
    playersWithRank.push({ ...player, rank: currentRank });
    previousValue = player.value;

    // 최대 3명까지만, 단 공동 1등이 3명이면 1등만 표시
    if (playersWithRank.length >= 3) {
      // 공동 1등이 3명인 경우, 1등만 표시
      if (playersWithRank.every((p) => p.rank === 1)) {
        break;
      }
      // 그 외의 경우는 3명까지 표시
      break;
    }
  }

  return playersWithRank;
}
