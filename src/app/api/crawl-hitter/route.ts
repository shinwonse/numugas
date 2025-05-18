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
            .find('td')
            .map((_, td) => $(td).text().trim())
            .get();
          if (cols.length === 0) return;
          players.push({
            rank: cols[0],
            name: cols[1],
            avg: cols[2],
            // ... 필요한 컬럼 추가
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
