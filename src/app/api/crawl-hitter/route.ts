import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const TARGET_URL =
  'http://www.gameone.kr/club/info/ranking/hitter?club_idx=35417';

const SEASONS = ['2020', '2021', '2022', '2023', '2024', '2025'];

export async function GET() {
  try {
    const results = await Promise.all(
      SEASONS.map(async (season) => {
        let url = TARGET_URL + `&season=${encodeURIComponent(season)}`;
        const { data: html } = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(html);
        const rows = $('table tr').slice(1);
        const players: any[] = [];
        rows.each((_, row) => {
          const cols = $(row)
            .find('th, td')
            .map((_, cell) => $(cell).text().trim())
            .get();
          if (cols.length === 0) return;
          players.push({
            rank: cols[0],
            name: cols[1],
            avg: cols[2],
            games: cols[3],
            plateAppearances: cols[4],
            atBats: cols[5],
            runs: cols[6],
            hits: cols[7],
            singles: cols[8],
            doubles: cols[9],
            triples: cols[10],
            homeRuns: cols[11],
            totalBases: cols[12],
            rbi: cols[13],
            stolenBases: cols[14],
            caughtStealing: cols[15],
            sacrificeHits: cols[16],
            sacrificeFlies: cols[17],
            walks: cols[18],
            intentionalWalks: cols[19],
            hitByPitch: cols[20],
            strikeouts: cols[21],
            doublePlays: cols[22],
            sluggingPercentage: cols[23],
            onBasePercentage: cols[24],
            // 필요시 추가 컬럼 매핑
          });
        });
        return { season, players };
      }),
    );
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: '크롤링 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
