import { supabase } from '@/lib/supabase';
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
        const rows = $('#require .ranking_table tbody tr');
        const players: any[] = [];
        rows.each((_, row) => {
          const cols = $(row)
            .find('th, td')
            .map((_, cell) => $(cell).text().trim())
            .get();
          if (cols.length === 0) return;
          players.push({
            season,
            name: cols[1],
            avg: cols[2],
            games: cols[3],
            plateappearances: cols[4],
            atbats: cols[5],
            runs: cols[6],
            hits: cols[7],
            singles: cols[8],
            doubles: cols[9],
            triples: cols[10],
            homeruns: cols[11],
            totalbases: cols[12],
            rbi: cols[13],
            stolenbases: cols[14],
            caughtstealing: cols[15],
            sacrificehits: cols[16],
            sacrificeflies: cols[17],
            walks: cols[18],
            intentionalwalks: cols[19],
            hitbypitch: cols[20],
            strikeouts: cols[21],
            doubleplays: cols[22],
            sluggingpercentage: cols[23],
            onbasepercentage: cols[24],
          });
        });
        if (players.length > 0) {
          const { error } = await supabase.from('hitter_stats').insert(players);
          if (error) {
            throw new Error(
              `Supabase insert error (season ${season}): ${error.message}`,
            );
          }
        }
        return { season, players };
      }),
    );
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: '크롤링 또는 저장 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
