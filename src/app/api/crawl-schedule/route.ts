import { supabase } from '@/lib/supabase';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const BASE_URL = 'http://www.gameone.kr';
const SCHEDULE_URL = `${BASE_URL}/club/info/schedule/table?club_idx=35417`;

function parseGames($: cheerio.CheerioAPI) {
  const rows = $('.game_table tbody tr');
  const games: any[] = [];
  rows.each((_, row) => {
    const cols = $(row).find('td');
    if (cols.length < 5) return;
    const date = cols.eq(0).text().trim();
    const category = cols.eq(1).text().trim();
    const stadium = cols.eq(2).text().trim();
    const $gameDiv = cols.eq(3).find('.game');
    const team1 = $gameDiv.find('.team1');
    const team2 = $gameDiv.find('.team2');
    const team1_name = team1.find('.team_name').text().trim();
    const team1_emblem = team1.find('img').attr('src')
      ? BASE_URL + team1.find('img').attr('src')
      : null;
    const team1_score = team1.find('.score').text().trim();
    const team2_name = team2.find('.team_name').text().trim();
    const team2_emblem = team2.find('img').attr('src')
      ? BASE_URL + team2.find('img').attr('src')
      : null;
    const team2_score = team2.find('.score').text().trim();
    const $resultA = cols.eq(4).find('a');
    const result_text = $resultA.text().trim();
    const result_link = $resultA.attr('href')
      ? BASE_URL + $resultA.attr('href')
      : null;
    games.push({
      date,
      category,
      stadium,
      team1_name,
      team1_emblem,
      team1_score,
      team2_name,
      team2_emblem,
      team2_score,
      result_text,
      result_link,
    });
  });
  return games;
}

async function getLastPageNumber($: cheerio.CheerioAPI) {
  let lastPage = 1;
  $('.pager ol.page li a').each((_, el) => {
    const page = Number($(el).text().trim());
    if (!isNaN(page) && page > lastPage) lastPage = page;
  });
  return lastPage;
}

export async function GET() {
  try {
    // 1. 첫 페이지에서 마지막 페이지 번호 추출
    const { data: html } = await axios.get(SCHEDULE_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(html);
    const lastPage = await getLastPageNumber($);

    // 2. 모든 페이지 크롤링
    let allGames: any[] = [];
    for (let page = 1; page <= lastPage; page++) {
      const url = `${SCHEDULE_URL}&page=${page}`;
      const { data: pageHtml } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const $$ = cheerio.load(pageHtml);
      const games = parseGames($$);
      allGames = allGames.concat(games);
    }

    // 3. Supabase upsert (중복방지: date, team1_name, team2_name 기준)
    if (allGames.length > 0) {
      const { error } = await supabase
        .from('schedule')
        .upsert(allGames, { onConflict: 'date,team1_name,team2_name' });
      if (error) {
        throw new Error(`Supabase upsert error: ${error.message}`);
      }
    }
    return NextResponse.json({ games: allGames });
  } catch (e) {
    return NextResponse.json(
      { error: '크롤링 또는 저장 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
