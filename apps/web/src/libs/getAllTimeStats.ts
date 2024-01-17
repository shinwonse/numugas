import getStats from '@numugas/util/crawler';

const NUMUGAS_SEASONS = ['2024', '2023', '2022', '2021', '2020'];

export const getAllTimeStats = async () => {
  const allTimeStatsPromises = NUMUGAS_SEASONS.map((season) => {
    return getStats(season);
  });
  return Promise.all(allTimeStatsPromises);
};
