import axios from 'axios';
import * as cheerio from 'cheerio';

export const getSchedules = async () => {
  const gameScheduleArray = [];
  try {
    const html = await axios.get('http://www.gameone.kr/club/?club_idx=35417');
    const $ = cheerio.load(html.data);
    $('.summary_list li .match').each((i, elem) => {
      const homeTeamEmblem = `http:${$(elem)
        .find('.team:nth-child(1) .emblem')
        .find('img')
        .attr('src')}`;
      const homeTeamName = $(elem)
        .find('.team:nth-child(1) .team_info dt')
        .text();
      const awayTeamEmblem = `http:${$(elem)
        .find('.team:nth-child(3) .emblem')
        .find('img')
        .attr('src')}`;
      const awayTeamName = $(elem)
        .find('.team:nth-child(3) .team_info dt')
        .text();
      const gameInfo = {
        awayTeam: {
          emblem: awayTeamEmblem,
          name: awayTeamName,
        },
        homeTeam: {
          emblem: homeTeamEmblem,
          name: homeTeamName,
        },
      };
      gameScheduleArray.push(gameInfo);
    });
  } catch (e) {
    console.error(e);
  }
  return gameScheduleArray;
};
