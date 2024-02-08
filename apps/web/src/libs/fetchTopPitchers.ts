import { fetchAllTimePitcherStats } from '#/libs/fetchAllTimePitcherStats';

export const fetchTopPitchers = async () => {
  const pitcherAllTimeStats = await fetchAllTimePitcherStats();
  const topWinPitcher = Array.from(pitcherAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.win) - Number(a.win);
    })
    .slice(0, 1)[0];
  const topInningPitcher = Array.from(pitcherAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.inning) - Number(a.inning);
    })
    .slice(0, 1)[0];
  const topSoPitcher = Array.from(pitcherAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.so) - Number(a.so);
    })
    .slice(0, 1)[0];
  return { topInningPitcher, topSoPitcher, topWinPitcher };
};
