import { fetchAllTimeBatterStats } from '#/libs/fetchAllTimeBatterStats';

export const fetchTopBatters = async () => {
  const batterAllTimeStats = await fetchAllTimeBatterStats();
  const topHitBatter = Array.from(batterAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.hit) - Number(a.hit);
    })
    .slice(0, 1)[0];
  const topHrBatter = Array.from(batterAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.hr) - Number(a.hr);
    })
    .slice(0, 1)[0];
  const topRbiBatter = Array.from(batterAllTimeStats.values())
    .sort((a, b) => {
      return Number(b.rbi) - Number(a.rbi);
    })
    .slice(0, 1)[0];
  return { topHitBatter, topHrBatter, topRbiBatter };
};
