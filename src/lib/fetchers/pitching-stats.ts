import { OVERALL_LEAGUE } from '@/lib/leagues';
import { extractTopPlayers } from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const SEASON_CATEGORIES = [
  { category: '이닝', key: 'innings' },
  { category: '승리', key: 'wins' },
  { category: '탈삼진', key: 'strikeouts' },
  { category: '세이브', key: 'saves' },
];

/** 올해 시즌 부문별 TOP3 (홈 화면) */
export async function fetchSeasonPitchingLeaders(season: string): Promise<Stat[]> {
  const { data: seasonStats, error } = await supabase
    .from('pitcher_stats')
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
