import {
  createFallbackStats,
  extractTopPlayers,
  groupByField,
  sumNumericFields,
} from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const SEASON_CATEGORIES = [
  { category: '이닝', key: 'innings' },
  { category: '승리', key: 'wins' },
  { category: '탈삼진', key: 'strikeouts' },
  { category: '세이브', key: 'saves' },
];

const NUMERIC_SUM_KEYS = ['wins', 'strikeouts', 'saves'];

function parseInning(inn: string | number) {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

export async function fetchPitchingStats2026(): Promise<Stat[]> {
  try {
    const { data: seasonStats, error } = await supabase
      .from('pitcher_stats')
      .select('*')
      .eq('season', '2026');

    if (error) {
      console.error('Failed to fetch pitching stats from Supabase:', error);
      throw new Error('기록을 불러오지 못했습니다.');
    }

    if (!Array.isArray(seasonStats)) {
      console.error('Invalid season stats data structure');
      throw new Error('기록 데이터가 올바르지 않습니다.');
    }

    const grouped = groupByField(seasonStats, 'name');
    const aggregated = Object.entries(grouped).map(([name, records]) => {
      const numericTotals = sumNumericFields(records, NUMERIC_SUM_KEYS);
      const totalInnings = records.reduce(
        (acc, cur) => acc + parseInning(cur.innings),
        0,
      );
      return {
        name,
        ...numericTotals,
        innings: totalInnings,
      };
    });

    return extractTopPlayers(aggregated, SEASON_CATEGORIES);
  } catch (error) {
    console.error('Failed to fetch pitching stats 2026:', error);
    return createFallbackStats(SEASON_CATEGORIES.map((c) => c.category));
  }
}
