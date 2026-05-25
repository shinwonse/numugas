import { OVERALL_LEAGUE } from '@/lib/leagues';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerName = searchParams.get('name');
  const season = searchParams.get('season');
  const league = searchParams.get('league');

  if (playerName) {
    let query = supabase
      .from('batter_stats')
      .select('*')
      .eq('name', playerName);
    if (league) query = query.eq('league', league);
    const { data, error } = await query.order('season', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ seasonStats: data });
  }

  if (season) {
    const leagueFilter = league || OVERALL_LEAGUE;
    const { data, error } = await supabase
      .from('batter_stats')
      .select('*')
      .eq('season', season)
      .eq('league', leagueFilter)
      .order('avg', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ seasonStats: data });
  }

  return NextResponse.json(
    { error: 'Missing player name or season' },
    { status: 400 },
  );
}
