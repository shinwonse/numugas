import { OVERALL_LEAGUE } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: hitterData, error: hitterError } = await supabase
    .from('batter_stats')
    .select('homeruns, totalbases, hits')
    .eq('league', OVERALL_LEAGUE);

  if (hitterError) {
    return NextResponse.json({ error: hitterError.message }, { status: 500 });
  }

  const { data: pitcherData, error: pitcherError } = await supabase
    .from('pitcher_stats')
    .select('strikeouts')
    .eq('league', OVERALL_LEAGUE);

  if (pitcherError) {
    return NextResponse.json({ error: pitcherError.message }, { status: 500 });
  }

  const hitterStats = hitterData.reduce(
    (acc, cur) => {
      acc.homeruns += Number(cur.homeruns) || 0;
      acc.totalbases += Number(cur.totalbases) || 0;
      acc.hits += Number(cur.hits) || 0;
      return acc;
    },
    { homeruns: 0, totalbases: 0, hits: 0 },
  );

  const strikeouts = pitcherData.reduce(
    (acc, cur) => acc + (Number(cur.strikeouts) || 0),
    0,
  );

  return NextResponse.json({
    ...hitterStats,
    strikeouts,
  });
}
