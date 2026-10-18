export const OPPONENTS_HREF = '/stats/opponents';

/** 상대 전적 페이지에서 해당 팀을 펼친 상태로 여는 링크 */
export function opponentHref(opponent: string) {
  return `${OPPONENTS_HREF}?team=${encodeURIComponent(opponent)}`;
}

/** "4승 3패" / 무승부가 있으면 "4승 3패 1무" */
export function formatWinLoss(r: { win: number; lose: number; draw: number }) {
  const base = `${String(r.win)}승 ${String(r.lose)}패`;
  return r.draw > 0 ? `${base} ${String(r.draw)}무` : base;
}
