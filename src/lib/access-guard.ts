// 서버 전용 (Server Action에서만 import)
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { headers } from 'next/headers';

export type AccessRole = 'team' | 'admin';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

async function clientKey(scope: string) {
  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown';
  return `${scope}:${ip}`;
}

function roleFor(secret: string): AccessRole | null {
  const admin = process.env.ADMIN_SECRET;
  const team = process.env.TEAM_SECRET;
  if (admin && secret === admin) return 'admin';
  if (team && secret === team) return 'team';
  return null;
}

/**
 * 비밀번호로 역할을 확인한다. 같은 IP에서 15분 안에 10번 틀리면 잠근다.
 * (관리자 키는 팀 열람 권한도 포함)
 */
export async function checkAccess(
  scope: string,
  secret: string,
): Promise<{ ok: true; role: AccessRole } | { ok: false; error: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.' };

  const key = await clientKey(scope);
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await db
    .from('access_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('client_key', key)
    .gte('created_at', since);
  if ((count ?? 0) >= MAX_FAILURES) {
    return { ok: false, error: '시도 횟수를 초과했습니다. 15분 뒤에 다시 시도하세요.' };
  }

  const role = roleFor(secret);
  if (!role) {
    await db.from('access_attempts').insert({ client_key: key });
    return { ok: false, error: '비밀번호가 올바르지 않습니다.' };
  }
  return { ok: true, role };
}
