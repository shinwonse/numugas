// 캘린더 순수 유틸리티 (외부 import 없음 — tests/calendar-utils.test.mjs에서 직접 로드)

export const OUR_TEAM_NAME = '담장NUMUGAS';

export type GameResult = '승' | '패' | '무';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * gameone 일정 날짜 문자열("11월21일(토) 09:00")을 KST 기준 ISO 문자열로 변환.
 * 날짜에 연도가 없어서 시즌 연도를 붙인다. 겨울 리그처럼 시즌 목록에 다음 해 초
 * 경기가 섞여 있는 경우가 있어, 요일 라벨이 시즌+1년에만 맞으면 다음 해로 본다.
 * 시간이 없으면 00:00으로 간주한다. 파싱할 수 없으면 null.
 */
export function parseGameDate(raw: string, season: number): string | null {
  const match = raw.match(/(\d{1,2})월\s*(\d{1,2})일(?:\s*\(([^)]*)\))?(?:\s*(\d{1,2}):(\d{2}))?/);
  if (!match) return null;

  const [, month, day, weekdayLabel, hour = '0', minute = '00'] = match;
  const m = Number(month);
  const d = Number(day);

  const isValidDate = (year: number) => {
    const date = new Date(Date.UTC(year, m - 1, d));
    return date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  };
  const weekdayFits = (year: number) =>
    WEEKDAY_LABELS[new Date(Date.UTC(year, m - 1, d)).getUTCDay()] ===
    weekdayLabel?.trim();

  let year = season;
  if (
    weekdayLabel &&
    !weekdayFits(season) &&
    isValidDate(season + 1) &&
    weekdayFits(season + 1)
  ) {
    year = season + 1;
  }
  // 2월 30일 같은 잘못된 날짜 거르기
  if (!isValidDate(year)) return null;

  const pad = (v: string) => v.padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${minute}:00+09:00`;
}

export interface GameSide {
  team1_name: string;
  team1_score: string;
  team2_name: string;
  team2_score: string;
}

/**
 * 우리 팀 관점의 상대팀/점수/결과. 점수가 없으면(경기 전) result/score는 null.
 */
export function getGameOutcome(game: GameSide): {
  opponent: string;
  score: { ours: number; theirs: number } | null;
  result: GameResult | null;
} {
  const weAreTeam1 = game.team1_name === OUR_TEAM_NAME;
  const opponent = weAreTeam1 ? game.team2_name : game.team1_name;
  const oursRaw = weAreTeam1 ? game.team1_score : game.team2_score;
  const theirsRaw = weAreTeam1 ? game.team2_score : game.team1_score;

  const ours = Number.parseInt(oursRaw, 10);
  const theirs = Number.parseInt(theirsRaw, 10);
  if (Number.isNaN(ours) || Number.isNaN(theirs)) {
    return { opponent, score: null, result: null };
  }

  const result: GameResult = ours > theirs ? '승' : ours < theirs ? '패' : '무';
  return { opponent, score: { ours, theirs }, result };
}

/** "2026-10" 형식 파싱. 잘못된 값이면 null. */
export function parseMonthParam(
  value: string | undefined,
): { year: number; month: number } | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || year < 2000 || year > 2100) return null;
  return { year, month };
}

export function formatMonthParam(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** 해당 월의 KST 범위 [start, end) ISO 문자열 */
export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const next = shiftMonth(year, month, 1);
  return {
    start: `${formatMonthParam(year, month)}-01T00:00:00+09:00`,
    end: `${formatMonthParam(next.year, next.month)}-01T00:00:00+09:00`,
  };
}

/** ISO 시각을 KST 날짜 키("2026-10-15")로 변환 */
export function toKstDateKey(iso: string): string {
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

/** ISO 시각을 KST "HH:mm"으로 변환 */
export function toKstTime(iso: string): string {
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(11, 16);
}

/**
 * 월간 달력 그리드(일요일 시작, 6주 고정이 아닌 필요한 주 수만큼).
 * 해당 월이 아닌 칸은 null.
 */
export function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${formatMonthParam(year, month)}-${String(day).padStart(2, '0')}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** 진행 중인 경기도 홈에 남도록 시작 후 이 시간까지는 '다가오는 일정'으로 본다 */
const IN_PROGRESS_GRACE_MS = 3 * 60 * 60 * 1000;

/**
 * 아직 끝나지 않은 일정인지. 종일 일정은 해당 날짜(KST)가 지나기 전까지,
 * 종료 시각이 있으면 종료 전까지, 없으면 시작 후 3시간까지.
 */
export function isUpcoming(
  item: { startsAt: string; endsAt?: string | null; allDay?: boolean },
  now: number,
): boolean {
  if (item.allDay) {
    return toKstDateKey(item.startsAt) >= toKstDateKey(new Date(now).toISOString());
  }
  const end = item.endsAt
    ? new Date(item.endsAt).getTime()
    : new Date(item.startsAt).getTime() + IN_PROGRESS_GRACE_MS;
  return end > now;
}
