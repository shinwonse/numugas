import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  // team_records 테이블에서 전체 합산
  const { data, error } = await supabase
    .from('team_records')
    .select('win, lose, draw');

  if (error) {
    return NextResponse.json(
      { error: 'DB 조회 실패', detail: String(error) },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: '팀 성적 데이터가 없습니다.' },
      { status: 404 },
    );
  }

  // 합산
  const total = data.reduce(
    (acc, cur) => {
      acc.win += cur.win;
      acc.lose += cur.lose;
      acc.draw += cur.draw;
      return acc;
    },
    { win: 0, lose: 0, draw: 0 },
  );
  const total_games = total.win + total.lose + total.draw;
  const win_rate =
    total_games > 0 ? Number(((total.win / total_games) * 100).toFixed(1)) : 0;

  return NextResponse.json({
    win: total.win,
    lose: total.lose,
    draw: total.draw,
    total_games,
    win_rate, // %
  });
}
