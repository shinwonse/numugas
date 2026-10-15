import { axiosInstance } from '@/lib/axios';
import { parseGameDate } from '@/lib/calendar-utils';
import { getCrawlSeasons } from '@/lib/seasons';
import { supabase } from '@/lib/supabase';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const BASE_URL = 'http://www.gameone.kr';
const SCHEDULE_URL = `${BASE_URL}/club/info/schedule/table?club_idx=35417&kind=`;

function parseGames($: cheerio.CheerioAPI, season: number) {
  const rows = $('.game_table tbody tr');
  const games: any[] = [];
  rows.each((_, row) => {
    const cols = $(row).find('td');
    if (cols.length < 5) return;
    const date = cols.eq(0).text().trim();
    const game_at = parseGameDate(date, season);
    if (!game_at) return;
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
      season,
      game_at,
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

async function crawlSeason(season: string) {
  const seasonUrl = `${SCHEDULE_URL}&season=${season}`;
  const { data: html } = await axiosInstance.get(seasonUrl);
  const $ = cheerio.load(html);
  const lastPage = await getLastPageNumber($);

  let games = parseGames($, Number(season));
  for (let page = 2; page <= lastPage; page++) {
    const { data: pageHtml } = await axiosInstance.get(
      `${seasonUrl}&page=${page}`,
    );
    games = games.concat(parseGames(cheerio.load(pageHtml), Number(season)));
  }
  return games;
}

export async function GET() {
  try {
    // 1. 시즌별 크롤링 (gameone 날짜에는 연도가 없어서 시즌으로 연도를 붙인다)
    let allGames: any[] = [];
    for (const season of getCrawlSeasons()) {
      allGames = allGames.concat(await crawlSeason(season));
    }

    // 같은 배치 안에 중복 키가 있으면 upsert가 실패하므로 미리 제거
    allGames = Array.from(
      new Map(
        allGames.map((g) => [`${g.game_at}|${g.team1_name}|${g.team2_name}`, g]),
      ).values(),
    );

    // 2. Supabase upsert (중복방지: game_at, team1_name, team2_name 기준)
    if (allGames.length > 0) {
      const { error } = await supabase
        .from('schedule')
        .upsert(allGames, { onConflict: 'game_at,team1_name,team2_name' });
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
