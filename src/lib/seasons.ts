const FIRST_SEASON = 2020;

/** gameone 크롤링 대상 시즌 (2020 ~ 올해) */
export function getCrawlSeasons(): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - FIRST_SEASON + 1 }, (_, i) =>
    String(FIRST_SEASON + i),
  );
}
