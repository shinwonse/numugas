import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: hitterData, error: hitterError } = await supabase
    .from('batter_stats')
    .select('homeruns, totalbases, hits');

  if (hitterError) {
    return NextResponse.json({ error: hitterError.message }, { status: 500 });
  }

  const { data: pitcherData, error: pitcherError } = await supabase
    .from('pitcher_stats')
    .select('strikeouts');

  if (pitcherError) {
    return NextResponse.json({ error: pitcherError.message }, { status: 500 });
  }

  const hitterStats = hitterData.reduce(
    (acc, cur) => {
      acc.homeruns += cur.homeruns;
      acc.totalbases += cur.totalbases;
      acc.hits += cur.hits;
      return acc;
    },
    { homeruns: 0, totalbases: 0, hits: 0 },
  );

  const strikeouts = pitcherData.reduce((acc, cur) => acc + cur.strikeouts, 0);

  return NextResponse.json({
    ...hitterStats,
    strikeouts,
  });
}
