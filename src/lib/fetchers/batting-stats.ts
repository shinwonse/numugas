import { OVERALL_LEAGUE } from '@/lib/leagues';
import { extractTopPlayers } from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const SEASON_CATEGORIES = [
  { category: '안타', key: 'hits' },
  { category: '홈런', key: 'homeruns' },
  { category: '타점', key: 'rbi' },
  { category: '도루', key: 'stolenbases' },
];

/** 올해 시즌 부문별 TOP3 (홈 화면) */
export async function fetchSeasonBattingLeaders(season: string): Promise<Stat[]> {
  const { data: seasonStats, error } = await supabase
    .from('batter_stats')
    .select('*')
    .eq('season', season)
    .eq('league', OVERALL_LEAGUE);

  if (error) {
    throw new Error('기록을 불러오지 못했습니다.');
  }

  if (!Array.isArray(seasonStats)) {
    throw new Error('기록 데이터가 올바르지 않습니다.');
  }

  return extractTopPlayers(seasonStats, SEASON_CATEGORIES);
}
