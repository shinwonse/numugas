import axios from 'axios';
import * as cheerio from 'cheerio';

type PlayerInfo = {
  ab: number;
  avg: number;
  bb: number;
  cs: number;
  games: number;
  gdp: number;
  hbp: number;
  hit: number;
  hr: number;
  name: string;
  obp: number;
  oneBaseHit: number;
  ops: number;
  pa: number;
  rbi: number;
  run: number;
  sb: number;
  sh: number;
  slg: number;
  so: number;
  tb: number;
  threeBaseHit: number;
  twoBaseHit: number;
};

const GAME_ONE_URL =
  'http://www.gameone.kr/club/info/ranking/hitter?club_idx=35417';

const truncateToThreeDecimalPlaces = (input: string): string => {
  return input
    .split(/[^\d.]+/) // Split the string on non-numeric and non-dot characters
    .map((num) => parseFloat(num).toFixed(3)) // Convert each part to a float and truncate
    .join(''); // Join the array back into a string
};

const getStats = async (season: string = '2023'): Promise<PlayerInfo[]> => {
  const playerInfoArray: PlayerInfo[] = [];
  try {
    const html = await axios.get(`${GAME_ONE_URL}&kind=&season=${season}`);
    const $ = cheerio.load(html.data);
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    $('.ranking_table tbody tr').each((i, elem) => {
      const playerInfo = {
        name: $(elem).find('th:nth-child(2)').text(),
        games: Number($(elem).find('td:nth-child(4)').text()),
        avg: Number(truncateToThreeDecimalPlaces($(elem).find('td').text())),
        pa: Number($(elem).find('td:nth-child(5)').text()),
        ab: Number($(elem).find('td:nth-child(6)').text()),
        run: Number($(elem).find('td:nth-child(7)').text()),
        hit: Number($(elem).find('td:nth-child(8)').text()),
        oneBaseHit: Number($(elem).find('td:nth-child(9)').text()),
        twoBaseHit: Number($(elem).find('td:nth-child(10)').text()),
        threeBaseHit: Number($(elem).find('td:nth-child(11)').text()),
        hr: Number($(elem).find('td:nth-child(12)').text()),
        tb: Number($(elem).find('td:nth-child(13)').text()),
        rbi: Number($(elem).find('td:nth-child(14)').text()),
        sb: Number($(elem).find('td:nth-child(15)').text()),
        cs: Number($(elem).find('td:nth-child(16)').text()),
        sh: Number($(elem).find('td:nth-child(17)').text()),
        bb: Number($(elem).find('td:nth-child(19)').text()),
        hbp: Number($(elem).find('td:nth-child(21)').text()),
        so: Number($(elem).find('td:nth-child(22)').text()),
        gdp: Number($(elem).find('td:nth-child(23)').text()),
        slg: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(24)').text())
        ),
        obp: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(25)').text())
        ),
        ops: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(28)').text())
        ),
      };
      playerInfoArray.push(playerInfo);
    });
  } catch (error) {
    console.error(error);
  }
  return playerInfoArray;
};

export default getStats;
