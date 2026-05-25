import { axiosInstance } from '@/lib/axios';
import { LEAGUE_PARAMS, type LeagueParams, type League } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const TARGET_URL =
  'http://www.gameone.kr/club/info/ranking/hitter?club_idx=35417&kind=5';

const NUMERIC_FIELDS = [
  'games',
  'plateappearances',
  'atbats',
  'runs',
  'hits',
  'singles',
  'doubles',
  'triples',
  'homeruns',
  'totalbases',
  'rbi',
  'stolenbases',
  'caughtstealing',
  'sacrificehits',
  'sacrificeflies',
  'walks',
  'intentionalwalks',
  'hitbypitch',
  'strikeouts',
  'doubleplays',
];

type CrawlTask = {
  season: string;
  league: League;
  paramsList: LeagueParams[];
};

function buildTasks(): CrawlTask[] {
  const tasks: CrawlTask[] = [];
  for (const [season, leagueMap] of Object.entries(LEAGUE_PARAMS)) {
    for (const [league, paramsArr] of Object.entries(leagueMap)) {
      if (!paramsArr || paramsArr.length === 0) continue;
      tasks.push({
        season,
        league: league as League,
        paramsList: paramsArr,
      });
    }
  }
  return tasks;
}

async function fetchRows(
  season: string,
  league: League,
  params: LeagueParams,
) {
  const url =
    TARGET_URL +
    `&season=${encodeURIComponent(season)}` +
    `&lig_idx=${params.lig_idx}&group=${params.group}&part=${params.part}`;
  const { data: html } = await axiosInstance.get(url);
  const $ = cheerio.load(html);
  const rows = $('#require .ranking_table tbody tr');
  const players: any[] = [];
  rows.each((_, row) => {
    const cols = $(row)
      .find('th, td')
      .map((_, cell) => $(cell).text().trim())
      .get();
    if (cols.length === 0) return;

    const nameWithNumber = cols[1];
    const nameMatch = nameWithNumber.match(/^(.+?)\((\d+)\)$/);
    const playerName = nameMatch ? nameMatch[1].trim() : nameWithNumber;
    const backNumber = nameMatch ? nameMatch[2] : null;

    players.push({
      season,
      league,
      name: playerName,
      back_number: backNumber,
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
  return players;
}

function mergeByName(rows: any[]): any[] {
  const grouped: Record<string, any[]> = {};
  for (const r of rows) {
    (grouped[r.name] ??= []).push(r);
  }
  return Object.values(grouped).map((records) => {
    if (records.length === 1) return records[0];
    const base = records[0];
    const total: Record<string, number> = {};
    for (const f of NUMERIC_FIELDS) {
      total[f] = records.reduce(
        (acc, cur) => acc + (Number(cur[f]) || 0),
        0,
      );
    }
    const atbats = total.atbats;
    const hits = total.hits;
    const walks = total.walks;
    const hbp = total.hitbypitch;
    const sf = total.sacrificeflies;
    const tb = total.totalbases;
    const avg = atbats ? hits / atbats : 0;
    const obpDen = atbats + walks + hbp + sf;
    const obp = obpDen ? (hits + walks + hbp) / obpDen : 0;
    const slg = atbats ? tb / atbats : 0;

    const merged: Record<string, any> = {
      season: base.season,
      league: base.league,
      name: base.name,
      back_number: base.back_number,
      avg: avg.toFixed(3),
      sluggingpercentage: slg.toFixed(3),
      onbasepercentage: obp.toFixed(3),
    };
    for (const f of NUMERIC_FIELDS) {
      merged[f] = String(total[f]);
    }
    return merged;
  });
}

export async function GET() {
  try {
    const tasks = buildTasks();
    const results = await Promise.all(
      tasks.map(async (task) => {
        const allRows: any[] = [];
        for (const params of task.paramsList) {
          const rows = await fetchRows(task.season, task.league, params);
          allRows.push(...rows);
        }
        const players =
          task.paramsList.length > 1 ? mergeByName(allRows) : allRows;
        if (players.length > 0) {
          const { error } = await supabase
            .from('batter_stats')
            .upsert(players, { onConflict: 'season,name,league' });
          if (error) {
            throw new Error(
              `Supabase upsert error (${task.season} ${task.league}): ${error.message}`,
            );
          }
        }
        return {
          season: task.season,
          league: task.league,
          count: players.length,
        };
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
