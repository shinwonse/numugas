import getStats from '@numugas/util/crawler';

import { NUMUGAS_SEASONS } from '#/constants';

export const getAllTimeStats = async () => {
  const data = new Map();
  const allTimeStats = await Promise.all(
    NUMUGAS_SEASONS.map((season) => getStats(season))
  );
  allTimeStats.forEach((season) => {
    season.forEach((player) => {
      if (data.has(player.name)) {
        const playerData = data.get(player.name);
        playerData.ab += player.ab;
        playerData.bb += player.bb;
        playerData.cs += player.cs;
        playerData.games += player.games;
        playerData.gdp += player.gdp;
        playerData.hbp += player.hbp;
        playerData.hit += player.hit;
        playerData.hr += player.hr;
        playerData.sh += player.sh;
        playerData.oneBaseHit += player.oneBaseHit;
        playerData.twoBaseHit += player.twoBaseHit;
        playerData.threeBaseHit += player.threeBaseHit;
        playerData.pa += player.pa;
        playerData.run += player.run;
        playerData.tb += player.tb;
        playerData.rbi += player.rbi;
        playerData.so += player.so;
        playerData.sb += player.sb;
        playerData.slg = playerData.tb / playerData.ab;
        playerData.avg = playerData.hit / playerData.ab;
        playerData.obp =
          (playerData.hit + playerData.bb + playerData.hbp) /
          (playerData.ab + playerData.bb + playerData.hbp + playerData.sh);
        playerData.ops = playerData.slg + playerData.obp;
      } else {
        data.set(player.name, player);
      }
    });
  });
  return data;
};
