import axios from 'axios';
import * as cheerio from 'cheerio';

const GAME_ONE_BATTER_URL =
  'http://www.gameone.kr/club/info/ranking/batter?club_idx=35417';
const GAME_ONE_PITCHER_URL =
  'http://www.gameone.kr/club/info/ranking/pitcher?club_idx=35417';

type BatterInfo = {
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

type PitcherInfo = {
  ab: number;
  batter: number;
  bb: number;
  earnedRuns: number;
  era: number;
  games: number;
  hbp: number;
  hit: number;
  hitRate: number;
  hold: number;
  hr: number;
  inning: number;
  lose: number;
  name: string;
  pitch: number;
  runs: number;
  save: number;
  so: number;
  soRate: number;
  whip: number;
  win: number;
  winRate: number;
  wp: number;
};

const truncateToThreeDecimalPlaces = (input: string): string => {
  return input
    .split(/[^\d.]+/) // Split the string on non-numeric and non-dot characters
    .map((num) => parseFloat(num).toFixed(3)) // Convert each part to a float and truncate
    .join(''); // Join the array back into a string
};

export const getBatterStats = async (
  season: string = '2023'
): Promise<BatterInfo[]> => {
  const playerInfoArray: BatterInfo[] = [];
  try {
    const html = await axios.get(
      `${GAME_ONE_BATTER_URL}&kind=&season=${season}`
    );
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

export const getPitcherStats = async (
  season: string = '2023'
): Promise<PitcherInfo[]> => {
  const playerInfoArray: PitcherInfo[] = [];
  try {
    const html = await axios.get(
      `${GAME_ONE_PITCHER_URL}&kind=&season=${season}`
    );
    const $ = cheerio.load(html.data);
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    $('.ranking_table tbody tr').each((i, elem) => {
      const playerInfo = {
        name: $(elem).find('th:nth-child(2)').text(),
        games: Number($(elem).find('td:nth-child(4)').text()),
        era: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(3)').text())
        ),
        win: Number($(elem).find('td:nth-child(5)').text()),
        lose: Number($(elem).find('td:nth-child(6)').text()),
        save: Number($(elem).find('td:nth-child(7)').text()),
        hold: Number($(elem).find('td:nth-child(8)').text()),
        winRate: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(9)').text())
        ),
        batter: Number($(elem).find('td:nth-child(10)').text()),
        ab: Number($(elem).find('td:nth-child(11)').text()),
        pitch: Number($(elem).find('td:nth-child(12)').text()),
        inning: Number($(elem).find('td:nth-child(13)').text()),
        hit: Number($(elem).find('td:nth-child(14)').text()),
        hr: Number($(elem).find('td:nth-child(15)').text()),
        bb: Number($(elem).find('td:nth-child(18)').text()),
        hbp: Number($(elem).find('td:nth-child(20)').text()),
        so: Number($(elem).find('td:nth-child(21)').text()),
        wp: Number($(elem).find('td:nth-child(22)').text()),
        runs: Number($(elem).find('td:nth-child(24)').text()),
        earnedRuns: Number($(elem).find('td:nth-child(25)').text()),
        whip: Number($(elem).find('td:nth-child(26)').text()),
        hitRate: Number(
          truncateToThreeDecimalPlaces($(elem).find('td:nth-child(27)').text())
        ),
        soRate: Number(
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
