import { createFallbackStats, extractTopPlayers } from '@/lib/stats-utils';
import { supabase } from '@/lib/supabase';
import type { Stat } from '@/types/stats';

const SEASON_CATEGORIES = [
  { category: '이닝', key: 'innings' },
  { category: '승리', key: 'wins' },
  { category: '탈삼진', key: 'strikeouts' },
  { category: '세이브', key: 'saves' },
];

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

    return extractTopPlayers(
      seasonStats,
      SEASON_CATEGORIES,
      (p) => p.team || p.club || '',
    );
  } catch (error) {
    console.error('Failed to fetch pitching stats 2026:', error);
    return createFallbackStats(SEASON_CATEGORIES.map((c) => c.category));
  }
}
