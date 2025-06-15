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

          // 이름과 등번호 분리 (예: "신원세(2)" -> 이름: "신원세", 등번호: "2")
          const nameWithNumber = cols[1];
          const nameMatch = nameWithNumber.match(/^(.+?)\((\d+)\)$/);
          const playerName = nameMatch ? nameMatch[1].trim() : nameWithNumber;
          const backNumber = nameMatch ? nameMatch[2] : null;

          pitchers.push({
            season,
            name: playerName,
            back_number: backNumber,
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
          // First, get existing records for this season
          const { data: existingPitchers, error: fetchError } = await supabase
            .from('pitcher_stats')
            .select('name')
            .eq('season', season);

          if (fetchError) {
            throw new Error(
              `Failed to fetch existing pitchers (season ${season}): ${fetchError.message}`,
            );
          }

          // Create a map of existing pitcher names
          const existingPitcherNames = new Set(
            existingPitchers?.map((p) => p.name) || [],
          );

          // Split pitchers into new and existing
          const newPitchers = pitchers.filter(
            (p) => !existingPitcherNames.has(p.name),
          );
          const existingPitchersToUpdate = pitchers.filter((p) =>
            existingPitcherNames.has(p.name),
          );

          // Insert new pitchers
          if (newPitchers.length > 0) {
            const { error: insertError } = await supabase
              .from('pitcher_stats')
              .insert(newPitchers);

            if (insertError) {
              throw new Error(
                `Failed to insert new pitchers (season ${season}): ${insertError.message}`,
              );
            }
          }

          // Update existing pitchers
          if (existingPitchersToUpdate.length > 0) {
            for (const pitcher of existingPitchersToUpdate) {
              const { error: updateError } = await supabase
                .from('pitcher_stats')
                .update(pitcher)
                .eq('season', season)
                .eq('name', pitcher.name);

              if (updateError) {
                throw new Error(
                  `Failed to update pitcher ${pitcher.name} (season ${season}): ${updateError.message}`,
                );
              }
            }
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
