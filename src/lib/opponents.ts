/** 팀 기록(통산·시즌별 성적, 상대 전적) 페이지 */
export const TEAM_STATS_HREF = '/stats/team';

/** 팀 기록 페이지에서 해당 상대팀을 펼친 상태로 여는 링크 */
export function opponentHref(opponent: string) {
  return `${TEAM_STATS_HREF}?team=${encodeURIComponent(opponent)}`;
}

/** "4승 3패" / 무승부가 있으면 "4승 3패 1무" */
export function formatWinLoss(r: { win: number; lose: number; draw: number }) {
  const base = `${String(r.win)}승 ${String(r.lose)}패`;
  return r.draw > 0 ? `${base} ${String(r.draw)}무` : base;
}

/** 무승부를 뺀 승률 (".571"). 승패가 없으면 null */
export function formatWinRate(r: { win: number; lose: number }) {
  const decided = r.win + r.lose;
  return decided > 0 ? (r.win / decided).toFixed(3) : null;
}
