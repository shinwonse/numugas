import { supabase } from '@/lib/supabase';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const PITCHER_URL =
  'http://www.gameone.kr/club/info/ranking/pitcher?club_idx=35417';
const SEASONS = ['2020', '2021', '2022', '2023', '2024', '2025'];

function parseNumber(val: string, useNull = false) {
  if (val === '-' || val === '') return useNull ? null : 0;
  return isNaN(Number(val)) ? (useNull ? null : 0) : Number(val);
}

export async function GET() {
  try {
    const results = await Promise.all(
      SEASONS.map(async (season) => {
        let url = PITCHER_URL + `&season=${encodeURIComponent(season)}`;
        const { data: html } = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(html);
        const rows = $('#require .ranking_table tbody tr');
        const pitchers: any[] = [];
        rows.each((_, row) => {
          const cols = $(row)
            .find('th, td')
            .map((_, cell) => $(cell).text().trim())
            .get();
          if (cols.length === 0) return;
          pitchers.push({
            season,
            name: cols[1],
            era: parseNumber(cols[2], true),
            games: parseNumber(cols[3]),
            wins: parseNumber(cols[4]),
            losses: parseNumber(cols[5]),
            saves: parseNumber(cols[6]),
            holds: parseNumber(cols[7]),
            winrate: parseNumber(cols[8], true),
            batters: parseNumber(cols[9]),
            atbats: parseNumber(cols[10]),
            pitches: parseNumber(cols[11]),
            innings: cols[12],
            hits: parseNumber(cols[13]),
            homeruns: parseNumber(cols[14]),
            sacrificehits: parseNumber(cols[15]),
            sacrificeflies: parseNumber(cols[16]),
            walks: parseNumber(cols[17]),
            intentionalwalks: parseNumber(cols[18]),
            hitbypitch: parseNumber(cols[19]),
            strikeouts: parseNumber(cols[20]),
            wildpitches: parseNumber(cols[21]),
            balks: parseNumber(cols[22]),
            runs: parseNumber(cols[23]),
            earnedruns: parseNumber(cols[24]),
            whip: parseNumber(cols[25], true),
            opponent_avg: parseNumber(cols[26], true),
            strikeout_rate: parseNumber(cols[27], true),
          });
        });
        if (pitchers.length > 0) {
          const { error } = await supabase
            .from('pitcher_stats')
            .upsert(pitchers, { onConflict: 'season,name' });
          if (error) {
            throw new Error(
              `Supabase upsert error (season ${season}): ${error.message}`,
            );
          }
        }
        return { season, pitchers };
      }),
    );
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: '투수 크롤링 또는 저장 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
