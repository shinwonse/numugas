// 서버 전용 (크롤링 Route Handler에서만 import)
import { NextResponse } from 'next/server';

/** 크롤링 라우트를 호출할 때 관리자 키를 담는 헤더 */
export const CRAWL_SECRET_HEADER = 'x-admin-secret';

/**
 * 크롤링 라우트는 Supabase에 쓰기 때문에 관리자 키가 있어야 실행한다.
 * 통과하면 null, 아니면 401 응답을 돌려준다.
 */
export function rejectUnauthorizedCrawl(req: Request): NextResponse | null {
  const expected = process.env.ADMIN_SECRET;
  if (expected && req.headers.get(CRAWL_SECRET_HEADER) === expected) return null;
  return NextResponse.json({ error: '인증 실패' }, { status: 401 });
}
