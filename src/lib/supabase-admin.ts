import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * 서버 전용 service role 클라이언트 (RLS 우회). club_events 쓰기에만 사용.
 * 키가 없으면 null — 호출부에서 500으로 처리한다.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  adminClient ??= createClient(
    url,
    serviceRoleKey,
    { auth: { persistSession: false } },
  );
  return adminClient;
}
