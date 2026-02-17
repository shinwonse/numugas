import {
  createFallbackStats,
  extractTopPlayers,
  groupByField,
  sumNumericFields,
} from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const PITCHING_SUM_FIELDS = [
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
] as const;

const CAREER_CATEGORIES = [
  { category: '이닝', key: 'innings' },
  { category: '승리', key: 'wins' },
  { category: '탈삼진', key: 'strikeouts' },
  { category: '세이브', key: 'saves' },
];

function parseInning(inn: string) {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

function calculatePitchingRates(
  total: Record<string, number>,
  totalInnings: number,
) {
  const era = totalInnings ? (total['earnedruns'] * 9) / totalInnings : 0;
  const whip = totalInnings
    ? (total['hits'] + total['walks']) / totalInnings
    : 0;
  const winRate =
    total['wins'] + total['losses']
      ? total['wins'] / (total['wins'] + total['losses'])
      : 0;
  const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
  const strikeoutRate = totalInnings
    ? (total['strikeouts'] * 9) / totalInnings
    : 0;

  return {
    innings: totalInnings.toFixed(1),
    era: era.toFixed(2),
    whip: whip.toFixed(2),
    winrate: winRate.toFixed(3),
    avg: avg.toFixed(3),
    strikeoutrate: strikeoutRate.toFixed(1),
  };
}

function aggregateCareerStats(data: Record<string, any>[]) {
  const grouped = groupByField(data, 'name');

  return Object.entries(grouped).map(([name, records]) => {
    const total = sumNumericFields(records, PITCHING_SUM_FIELDS);
    const totalInnings = records.reduce(
      (acc, cur) => acc + parseInning(cur.innings),
      0,
    );
    const rates = calculatePitchingRates(total, totalInnings);
    return { name, ...total, ...rates };
  });
}

export async function fetchPitchingCareerStats(): Promise<Stat[]> {
  try {
    const { data, error } = await supabase.from('pitcher_stats').select('*');

    if (error) {
      console.error(
        'Failed to fetch pitching career stats from Supabase:',
        error,
      );
      throw new Error('통산 기록을 불러오지 못했습니다.');
    }

    const careerStats = aggregateCareerStats(data ?? []);

    return extractTopPlayers(careerStats, CAREER_CATEGORIES);
  } catch (error) {
    console.error('Failed to fetch pitching career stats:', error);
    return createFallbackStats(CAREER_CATEGORIES.map((c) => c.category));
  }
}
