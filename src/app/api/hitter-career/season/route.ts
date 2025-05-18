import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerName = searchParams.get('name');
  const season = searchParams.get('season');

  if (playerName) {
    const { data, error } = await supabase
      .from('hitter_stats')
      .select('*')
      .eq('name', playerName)
      .order('season', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ seasonStats: data });
  }

  if (season) {
    const { data, error } = await supabase
      .from('hitter_stats')
      .select('*')
      .eq('season', season)
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
