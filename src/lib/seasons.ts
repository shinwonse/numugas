const FIRST_SEASON = 2020;

/** 통산 기록을 뜻하는 시즌 값 (URL·셀렉트에서 연도 대신 쓰인다) */
export const CAREER_SEASON = '통산';

/** 올해 시즌 ("2026"). 홈 화면 주요 기록과 기록 페이지 기본값에 쓴다. */
export function getCurrentSeason(): string {
  return String(new Date().getFullYear());
}

/** gameone 크롤링 대상 시즌 (2020 ~ 올해) */
export function getCrawlSeasons(): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - FIRST_SEASON + 1 }, (_, i) =>
    String(FIRST_SEASON + i),
  );
}

/** 기록 페이지에서 고를 수 있는 시즌: 통산 + 최신 연도부터 */
export function getStatsSeasons(): string[] {
  return [CAREER_SEASON, ...getCrawlSeasons().reverse()];
}
