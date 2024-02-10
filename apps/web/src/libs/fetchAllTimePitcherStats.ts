import { getPitcherStats } from '@numugas/util/src/crawlStatFromGameOne';

import { NUMUGAS_SEASONS } from '#/constants';

export const fetchAllTimePitcherStats = async () => {
  const data = new Map();
  const allTimeStats = await Promise.all(
    NUMUGAS_SEASONS.map((season) => getPitcherStats(season))
  );
  allTimeStats.forEach((season) => {
    season.forEach((player) => {
      if (data.has(player.name)) {
        const playerData = data.get(player.name);
        playerData.games += player.games;
        playerData.win += player.win;
        playerData.lose += player.lose;
        playerData.save += player.save;
        playerData.hold += player.hold;
        playerData.winRate =
          playerData.win / (playerData.win + playerData.lose);
        playerData.era = (playerData.earnedRuns / playerData.inning) * 9;
        playerData.hit += player.hit;
        playerData.hr += player.hr;
        playerData.bb += player.bb;
        playerData.so += player.so;
        playerData.runs += player.runs;
        playerData.earnedRuns += player.earnedRuns;
        playerData.whip = (playerData.h + playerData.bb) / playerData.ip;
        playerData.pitch += player.pitch;
        playerData.ab += player.ab;
        playerData.batter += player.batter;
        // Calculate cumulative innings.
        const totalInnings = playerData.inning + player.inning;
        let wholeInnings = Math.floor(totalInnings);
        let fractionalInnings = Number((totalInnings % 1).toFixed(1));
        if (fractionalInnings > 0.2) {
          wholeInnings += 1;
          fractionalInnings -= 0.3;
        }
        playerData.inning = wholeInnings + fractionalInnings;
      } else {
        data.set(player.name, player);
      }
    });
  });
  return data;
};
