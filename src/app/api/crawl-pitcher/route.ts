import { axiosInstance } from '@/lib/axios';
import { LEAGUE_PARAMS, type LeagueParams, type League } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const PITCHER_URL =
  'http://www.gameone.kr/club/info/ranking/pitcher?club_idx=35417&kind=5';

const NUMERIC_FIELDS = [
  'games',
  'wins',
  'losses',
  'saves',
  'holds',
  'batters',
  'atbats',
  'pitches',
  'hits',
  'homeruns',
  'sacrificehits',
  'sacrificeflies',
  'walks',
  'intentionalwalks',
  'hitbypitch',
  'strikeouts',
  'wildpitches',
  'balks',
  'runs',
  'earnedruns',
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

function parseNumber(val: string, useNull = false) {
  if (val === '-' || val === '') return useNull ? null : 0;
  return isNaN(Number(val)) ? (useNull ? null : 0) : Number(val);
}

function parseInning(inn: string | number | null | undefined) {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

function formatInning(decimalInnings: number): string {
  const whole = Math.floor(decimalInnings);
  const fracDec = decimalInnings - whole;
  const thirds = Math.round(fracDec * 3);
  if (thirds === 0) return `${whole}.0`;
  if (thirds === 3) return `${whole + 1}.0`;
  return `${whole}.${thirds}`;
}

async function fetchRows(
  season: string,
  league: League,
  params: LeagueParams,
) {
  const url =
    PITCHER_URL +
    `&season=${encodeURIComponent(season)}` +
    `&lig_idx=${params.lig_idx}&group=${params.group}&part=${params.part}`;
  const { data: html } = await axiosInstance.get(url);
  const $ = cheerio.load(html);
  const rows = $('#require .ranking_table tbody tr');
  const pitchers: any[] = [];
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

    pitchers.push({
      season,
      league,
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
  return pitchers;
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
    const totalInnings = records.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );
    const era = totalInnings
      ? Number(((total.earnedruns * 9) / totalInnings).toFixed(2))
      : null;
    const whip = totalInnings
      ? Number(((total.hits + total.walks) / totalInnings).toFixed(2))
      : null;
    const winrate =
      total.wins + total.losses > 0
        ? Number((total.wins / (total.wins + total.losses)).toFixed(3))
        : null;
    const opponent_avg = total.atbats
      ? Number((total.hits / total.atbats).toFixed(3))
      : null;
    const strikeout_rate = total.batters
      ? Number(((total.strikeouts / total.batters) * 100).toFixed(1))
      : null;

    return {
      season: base.season,
      league: base.league,
      name: base.name,
      back_number: base.back_number,
      ...total,
      innings: formatInning(totalInnings),
      era,
      whip,
      winrate,
      opponent_avg,
      strikeout_rate,
    };
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
        const pitchers =
          task.paramsList.length > 1 ? mergeByName(allRows) : allRows;
        if (pitchers.length > 0) {
          const { error } = await supabase
            .from('pitcher_stats')
            .upsert(pitchers, { onConflict: 'season,name,league' });
          if (error) {
            throw new Error(
              `Supabase upsert error (${task.season} ${task.league}): ${error.message}`,
            );
          }
        }
        return {
          season: task.season,
          league: task.league,
          count: pitchers.length,
        };
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
