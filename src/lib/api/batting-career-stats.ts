import {
  createFallbackStats,
  extractTopPlayers,
  groupByField,
  sumNumericFields,
} from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const BATTING_SUM_FIELDS = [
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
] as const;

const CAREER_CATEGORIES = [
  { category: '안타', key: 'hits' },
  { category: '홈런', key: 'homeruns' },
  { category: '타점', key: 'rbi' },
  { category: '도루', key: 'stolenbases' },
];

function calculateBattingRates(total: Record<string, number>) {
  const avg = total['atbats'] ? total['hits'] / total['atbats'] : 0;
  const onbase =
    total['atbats'] +
    total['walks'] +
    total['hitbypitch'] +
    total['sacrificeflies'];
  const onbasepercentage = onbase
    ? (total['hits'] + total['walks'] + total['hitbypitch']) / onbase
    : 0;
  const sluggingpercentage = total['atbats']
    ? total['totalbases'] / total['atbats']
    : 0;

  return {
    avg: avg.toFixed(3),
    onbasepercentage: onbasepercentage.toFixed(3),
    sluggingpercentage: sluggingpercentage.toFixed(3),
  };
}

function aggregateCareerStats(data: Record<string, any>[]) {
  const grouped = groupByField(data, 'name');

  return Object.entries(grouped).map(([name, records]) => {
    const total = sumNumericFields(records, BATTING_SUM_FIELDS);
    const rates = calculateBattingRates(total);
    return { name, ...total, ...rates };
  });
}

export async function fetchBattingCareerStats(): Promise<Stat[]> {
  try {
    const { data, error } = await supabase.from('batter_stats').select('*');

    if (error) {
      console.error(
        'Failed to fetch batting career stats from Supabase:',
        error,
      );
      throw new Error('통산 기록을 불러오지 못했습니다.');
    }

    const careerStats = aggregateCareerStats(data ?? []);

    return extractTopPlayers(careerStats, CAREER_CATEGORIES);
  } catch (error) {
    console.error('Failed to fetch batting career stats:', error);
    return createFallbackStats(CAREER_CATEGORIES.map((c) => c.category));
  }
}
