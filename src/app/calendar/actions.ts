'use server';

import {
  isAdminSecret,
  validateClubEvent,
  type ClubEventInput,
} from '@/lib/club-events-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

/**
 * 캘린더 관리 모드용 Server Action.
 * Action 안에서 revalidatePath를 호출하면 응답에 새로 렌더링된 화면이 함께 와서
 * (read-your-own-writes) 저장 직후 캘린더에 바로 반영된다.
 */
export type AdminActionResult =
  | { ok: true }
  | { ok: false; status: 400 | 401 | 500; error: string };

function unauthorized(): AdminActionResult {
  return { ok: false, status: 401, error: '인증 실패' };
}

const MISSING_KEY: AdminActionResult = {
  ok: false,
  status: 500,
  error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.',
};

// Server Action은 async여야 한다 (await할 작업은 없음)
// eslint-disable-next-line @typescript-eslint/require-await
export async function verifyCalendarAdmin(secret: string): Promise<boolean> {
  return isAdminSecret(secret);
}

export async function saveClubEventAction(
  secret: string,
  id: string | null,
  input: ClubEventInput,
): Promise<AdminActionResult> {
  if (!isAdminSecret(secret)) return unauthorized();
  const parsed = validateClubEvent(input);
  if ('error' in parsed) return { ok: false, status: 400, error: parsed.error };
  const db = getSupabaseAdmin();
  if (!db) return MISSING_KEY;

  const { error } = id
    ? await db.from('club_events').update(parsed.value).eq('id', id)
    : await db.from('club_events').insert(parsed.value);
  if (error) return { ok: false, status: 500, error: error.message };

  revalidatePath('/calendar', 'layout');
  revalidatePath('/stats/opponents');
  return { ok: true };
}

export async function deleteClubEventAction(
  secret: string,
  id: string,
): Promise<AdminActionResult> {
  if (!isAdminSecret(secret)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return MISSING_KEY;

  const { error } = await db.from('club_events').delete().eq('id', id);
  if (error) return { ok: false, status: 500, error: error.message };

  revalidatePath('/calendar', 'layout');
  revalidatePath('/stats/opponents');
  return { ok: true };
}
