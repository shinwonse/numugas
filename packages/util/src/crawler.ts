import axios from "axios";
import * as cheerio from "cheerio";

type PlayerInfo = {
  ab: string;
  avg: string;
  bb: string;
  cs: string;
  games: string;
  gdp: string;
  hbp: string;
  hit: string;
  hr: string;
  name: string;
  obp: string;
  oneBaseHit: string;
  ops: string;
  pa: string;
  rbi: string;
  run: string;
  sb: string;
  sh: string;
  slg: string;
  so: string;
  tb: string;
  threeBaseHit: string;
  twoBaseHit: string;
};

const GAME_ONE_URL =
  "http://www.gameone.kr/club/info/ranking/hitter?club_idx=35417";

const truncateToThreeDecimalPlaces = (input: string): string => {
  return input
    .split(/[^\d.]+/) // Split the string on non-numeric and non-dot characters
    .map((num) => parseFloat(num).toFixed(3)) // Convert each part to a float and truncate
    .join(""); // Join the array back into a string
};

const getStats = async (season: string = "2023"): Promise<PlayerInfo[]> => {
  const playerInfoArray: PlayerInfo[] = [];
  try {
    const html = await axios.get(`${GAME_ONE_URL}&kind=&season=${season}`);
    const $ = cheerio.load(html.data);
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    $(".ranking_table tbody tr").each((i, elem) => {
      const playerInfo = {
        name: $(elem).find("th:nth-child(2)").text(),
        games: $(elem).find("td:nth-child(4)").text(),
        avg: truncateToThreeDecimalPlaces($(elem).find("td").text()),
        pa: $(elem).find("td:nth-child(5)").text(),
        ab: $(elem).find("td:nth-child(6)").text(),
        run: $(elem).find("td:nth-child(7)").text(),
        hit: $(elem).find("td:nth-child(8)").text(),
        oneBaseHit: $(elem).find("td:nth-child(9)").text(),
        twoBaseHit: $(elem).find("td:nth-child(10)").text(),
        threeBaseHit: $(elem).find("td:nth-child(11)").text(),
        hr: $(elem).find("td:nth-child(12)").text(),
        tb: $(elem).find("td:nth-child(13)").text(),
        rbi: $(elem).find("td:nth-child(14)").text(),
        sb: $(elem).find("td:nth-child(15)").text(),
        cs: $(elem).find("td:nth-child(16)").text(),
        sh: $(elem).find("td:nth-child(17)").text(),
        bb: $(elem).find("td:nth-child(19)").text(),
        hbp: $(elem).find("td:nth-child(21)").text(),
        so: $(elem).find("td:nth-child(22)").text(),
        gdp: $(elem).find("td:nth-child(23)").text(),
        slg: truncateToThreeDecimalPlaces(
          $(elem).find("td:nth-child(24)").text()
        ),
        obp: truncateToThreeDecimalPlaces(
          $(elem).find("td:nth-child(25)").text()
        ),
        ops: truncateToThreeDecimalPlaces(
          $(elem).find("td:nth-child(28)").text()
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

// getStats(
//   "http://www.gameone.kr/club/info/ranking/hitter?club_idx=35417&kind=&season=2023"
// );
