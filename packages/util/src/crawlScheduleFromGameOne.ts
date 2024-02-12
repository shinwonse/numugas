import axios from 'axios';
import * as cheerio from 'cheerio';

type Schedule = {
  awayTeam: {
    emblem: string;
    name: string;
  };
  date: string;
  homeTeam: {
    emblem: string;
    name: string;
  };
  leagueName: string;
  stadium: string;
};

export const getSchedules = async (): Promise<Schedule[]> => {
  const gameScheduleArray: Schedule[] = [];
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
      const leagueName = $(elem).find('.game_info dt').text();
      const stadium = $(elem).find('.game_info .ground_name').text();
      const date = $(elem).find('.game_info strong').text();
      const gameInfo = {
        awayTeam: {
          emblem: awayTeamEmblem,
          name: awayTeamName,
        },
        date,
        homeTeam: {
          emblem: homeTeamEmblem,
          name: homeTeamName,
        },
        leagueName,
        stadium,
      };
      gameScheduleArray.push(gameInfo);
    });
  } catch (e) {
    console.error(e);
  }
  return gameScheduleArray;
};
