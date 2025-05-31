import { supabase } from '@/lib/supabase';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const SEASONS = ['2020', '2021', '2022', '2023', '2024', '2025'];
const CLUB_IDX = '35417';

export async function GET() {
  try {
    const results = await Promise.all(
      SEASONS.map(async (season) => {
        const url = `http://www.gameone.kr/club/info/schedule/table?club_idx=${CLUB_IDX}&kind=&season=${season}`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        const infoText = $('.game_tab_info .info').text();
        const recordMatch = infoText.match(/(\d+)승(\d+)패(\d+)무/);

        if (!recordMatch) {
          return { season, error: '팀 성적을 찾을 수 없습니다.' };
        }

        const [, win, lose, draw] = recordMatch;

        const record = {
          season: Number(season),
          win: Number(win),
          lose: Number(lose),
          draw: Number(draw),
        };

        // DB 저장
        const { error } = await supabase
          .from('team_records')
          .upsert([record], { onConflict: 'season' });
        if (error) {
          throw new Error(
            `Supabase upsert error (season ${season}): ${error.message}`,
          );
        }

        return record;
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
