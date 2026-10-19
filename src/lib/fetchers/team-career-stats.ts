import { formatInning, parseInning } from '@/lib/inning';
import { OVERALL_LEAGUE } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import type { TeamCareerStats } from '@/types/stats';

const BATTER_FIELDS = [
  'atbats',
  'hits',
  'doubles',
  'triples',
  'homeruns',
  'totalbases',
  'rbi',
  'runs',
  'stolenbases',
  'walks',
  'hitbypitch',
  'sacrificeflies',
] as const;

const PITCHER_FIELDS = ['strikeouts', 'earnedruns', 'hits', 'walks'] as const;

function sumFields<K extends string>(
  rows: Record<string, unknown>[],
  fields: readonly K[],
): Record<K, number> {
  const total = Object.fromEntries(fields.map((f) => [f, 0])) as Record<K, number>;
  for (const row of rows) {
    for (const f of fields) total[f] += Number(row[f]) || 0;
  }
  return total;
}

const rate = (value: number, digits: number) => value.toFixed(digits);

/** 선수 기록(전체 리그)을 합친 팀 통산 타격·투구 기록. 실패 시 throw. */
export async function fetchTeamCareerStats(): Promise<TeamCareerStats> {
  const [hitterRes, pitcherRes] = await Promise.all([
    supabase.from('batter_stats').select(BATTER_FIELDS.join(', ')).eq('league', OVERALL_LEAGUE),
    supabase
      .from('pitcher_stats')
      .select(`innings, ${PITCHER_FIELDS.join(', ')}`)
      .eq('league', OVERALL_LEAGUE),
  ]);

  if (hitterRes.error) throw hitterRes.error;
  if (pitcherRes.error) throw pitcherRes.error;

  const hitterRows = hitterRes.data as unknown as Record<string, unknown>[];
  const pitcherRows = pitcherRes.data as unknown as Record<string, unknown>[];

  const bat = sumFields(hitterRows, BATTER_FIELDS);
  const pitch = sumFields(pitcherRows, PITCHER_FIELDS);
  const innings = pitcherRows.reduce(
    (acc, row) => acc + parseInning(row.innings as string | number | null),
    0,
  );

  const onBaseChances = bat.atbats + bat.walks + bat.hitbypitch + bat.sacrificeflies;
  const avg = bat.atbats ? bat.hits / bat.atbats : 0;
  const obp = onBaseChances ? (bat.hits + bat.walks + bat.hitbypitch) / onBaseChances : 0;
  const slg = bat.atbats ? bat.totalbases / bat.atbats : 0;

  return {
    hits: bat.hits,
    doubles: bat.doubles,
    triples: bat.triples,
    homeruns: bat.homeruns,
    totalbases: bat.totalbases,
    rbi: bat.rbi,
    runs: bat.runs,
    stolenbases: bat.stolenbases,
    walks: bat.walks,
    avg: rate(avg, 3),
    obp: rate(obp, 3),
    slg: rate(slg, 3),
    ops: rate(obp + slg, 3),
    strikeouts: pitch.strikeouts,
    innings: formatInning(innings),
    era: rate(innings ? (pitch.earnedruns * 9) / innings : 0, 2),
    whip: rate(innings ? (pitch.hits + pitch.walks) / innings : 0, 2),
  };
}
