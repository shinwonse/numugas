import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const CRAWL_TARGETS = {
  batter: { label: '타자 기록', path: '/api/crawl-batter' },
  pitcher: { label: '투수 기록', path: '/api/crawl-pitcher' },
  team: { label: '팀 기록', path: '/api/crawl-team' },
  schedule: { label: '일정', path: '/api/crawl-schedule' },
} as const;

type CrawlTarget = keyof typeof CRAWL_TARGETS;

export async function POST(req: NextRequest) {
  // Auth check
  const { secret, targets } = (await req.json()) as {
    secret: string;
    targets?: CrawlTarget[];
  };

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  const targetKeys = targets ?? (Object.keys(CRAWL_TARGETS) as CrawlTarget[]);
  const results: Record<string, { success: boolean; message: string }> = {};

  // Run crawls sequentially to avoid overloading
  for (const key of targetKeys) {
    const target = CRAWL_TARGETS[key];
    if (!target) continue;

    try {
      const origin = req.nextUrl.origin;
      const res = await fetch(`${origin}${target.path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        results[key] = {
          success: false,
          message: body.error || `HTTP ${res.status}`,
        };
      } else {
        results[key] = { success: true, message: `${target.label} 갱신 완료` };
      }
    } catch (error) {
      results[key] = {
        success: false,
        message: `${target.label} 갱신 실패: ${String(error)}`,
      };
    }
  }

  // Revalidate cached pages
  revalidatePath('/');
  revalidatePath('/players');

  const allSuccess = Object.values(results).every((r) => r.success);

  return NextResponse.json({
    success: allSuccess,
    results,
    revalidated: ['/', '/players'],
  });
}
