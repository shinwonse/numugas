'use server';

import { checkAccess, type AccessRole } from '@/lib/access-guard';
import { validateLedgerEntry } from '@/lib/ledger-utils';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  DUES_STATUSES,
  type DuesRow,
  type DuesStatus,
  type LedgerData,
  type LedgerEntry,
  type LedgerEntryInput,
} from '@/types/ledger';

/**
 * 회계 장부는 공개 키로 읽을 수 없도록 RLS로 막혀 있다.
 * 모든 접근은 여기서 비밀번호를 확인한 뒤 service role로 처리한다.
 * (열람: 팀 비밀번호 또는 관리자 키, 수정: 관리자 키)
 */
type Result<T> = { ok: true; data: T } | { ok: false; status: 401 | 400 | 500; error: string };

const SCOPE = 'ledger';

async function loadLedger(): Promise<LedgerData> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');

  const [settings, entries, dues] = await Promise.all([
    db.from('ledger_settings').select('opening_balance, opening_date').eq('id', 1).single(),
    db
      .from('ledger_entries')
      .select('id, entry_date, kind, amount, counterparty, memo')
      .order('entry_date')
      .order('id'),
    db
      .from('dues_status')
      .select('year, member_name, quarter, status, sort_order')
      .order('year')
      .order('sort_order')
      .order('quarter'),
  ]);
  if (settings.error) throw settings.error;
  if (entries.error) throw entries.error;
  if (dues.error) throw dues.error;

  return {
    openingBalance: Number(settings.data.opening_balance),
    openingDate: settings.data.opening_date as string,
    // bigint 컬럼은 문자열로 올 수 있어 숫자로 맞춘다
    entries: (entries.data as LedgerEntry[]).map((e) => ({
      ...e,
      id: Number(e.id),
      amount: Number(e.amount),
    })),
    dues: dues.data as DuesRow[],
  };
}

async function authorize(
  secret: string,
  need: AccessRole,
): Promise<{ ok: true; role: AccessRole } | { ok: false; status: 401; error: string }> {
  const access = await checkAccess(SCOPE, secret);
  if (!access.ok) return { ok: false, status: 401, error: access.error };
  if (need === 'admin' && access.role !== 'admin') {
    return { ok: false, status: 401, error: '관리자만 수정할 수 있습니다.' };
  }
  return access;
}

async function respond<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    console.error('[ledger]', err);
    return { ok: false, status: 500, error: err instanceof Error ? err.message : '서버 오류' };
  }
}

/** 비밀번호 확인 + 장부 조회 */
export async function openLedger(
  secret: string,
): Promise<Result<{ role: AccessRole; ledger: LedgerData }>> {
  const auth = await authorize(secret, 'team');
  if (!auth.ok) return auth;
  return respond(async () => ({ role: auth.role, ledger: await loadLedger() }));
}

export async function saveLedgerEntry(
  secret: string,
  id: number | null,
  input: LedgerEntryInput,
): Promise<Result<LedgerData>> {
  const auth = await authorize(secret, 'admin');
  if (!auth.ok) return auth;
  const parsed = validateLedgerEntry(input);
  if ('error' in parsed) return { ok: false, status: 400, error: parsed.error };

  return respond(async () => {
    const db = getSupabaseAdmin();
    if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    const { error } = id
      ? await db
          .from('ledger_entries')
          .update({ ...parsed.value, updated_at: new Date().toISOString() })
          .eq('id', id)
      : await db.from('ledger_entries').insert(parsed.value);
    if (error) throw error;
    return loadLedger();
  });
}

export async function deleteLedgerEntry(
  secret: string,
  id: number,
): Promise<Result<LedgerData>> {
  const auth = await authorize(secret, 'admin');
  if (!auth.ok) return auth;
  return respond(async () => {
    const db = getSupabaseAdmin();
    if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    const { error } = await db.from('ledger_entries').delete().eq('id', id);
    if (error) throw error;
    return loadLedger();
  });
}

export async function setDuesStatus(
  secret: string,
  year: number,
  memberName: string,
  quarter: number,
  status: DuesStatus,
): Promise<Result<LedgerData>> {
  const auth = await authorize(secret, 'admin');
  if (!auth.ok) return auth;
  if (!DUES_STATUSES.includes(status) || quarter < 1 || quarter > 4) {
    return { ok: false, status: 400, error: '잘못된 회비 상태입니다.' };
  }
  return respond(async () => {
    const db = getSupabaseAdmin();
    if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    const { error } = await db
      .from('dues_status')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('year', year)
      .eq('member_name', memberName)
      .eq('quarter', quarter);
    if (error) throw error;
    return loadLedger();
  });
}

/** 해당 연도에 회원 추가 (4분기 모두 미납으로 시작) */
export async function addDuesMember(
  secret: string,
  year: number,
  memberName: string,
): Promise<Result<LedgerData>> {
  const auth = await authorize(secret, 'admin');
  if (!auth.ok) return auth;
  const name = memberName.trim();
  if (!name) return { ok: false, status: 400, error: '이름을 입력하세요.' };

  return respond(async () => {
    const db = getSupabaseAdmin();
    if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    const { data: last } = await db
      .from('dues_status')
      .select('sort_order')
      .eq('year', year)
      .order('sort_order', { ascending: false })
      .limit(1);
    const sortOrder = (last?.[0]?.sort_order ?? 0) + 1;
    const { error } = await db.from('dues_status').insert(
      [1, 2, 3, 4].map((quarter) => ({
        year,
        member_name: name,
        quarter,
        status: 'unpaid',
        sort_order: sortOrder,
      })),
    );
    if (error) {
      if (error.code === '23505') throw new Error(`${name}은(는) 이미 ${year}년 명단에 있습니다.`);
      throw error;
    }
    return loadLedger();
  });
}

/** 새 연도 시작: 직전 연도 명단을 복사해 모두 미납으로 시작 */
export async function startDuesYear(
  secret: string,
  year: number,
): Promise<Result<LedgerData>> {
  const auth = await authorize(secret, 'admin');
  if (!auth.ok) return auth;

  return respond(async () => {
    const db = getSupabaseAdmin();
    if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    const { count } = await db
      .from('dues_status')
      .select('year', { count: 'exact', head: true })
      .eq('year', year);
    if ((count ?? 0) > 0) throw new Error(`${year}년 명단이 이미 있습니다.`);

    // 직전 연도 4분기 기준: 휴면 회원은 휴면 유지, 나머지는 미납으로 시작
    const { data: prev, error: prevError } = await db
      .from('dues_status')
      .select('member_name, sort_order, status')
      .eq('year', year - 1)
      .eq('quarter', 4)
      .order('sort_order');
    if (prevError) throw prevError;

    const rows = (prev ?? []).flatMap((m) =>
      [1, 2, 3, 4].map((quarter) => ({
        year,
        member_name: m.member_name,
        quarter,
        status: m.status === 'dormant' ? 'dormant' : 'unpaid',
        sort_order: m.sort_order,
      })),
    );
    if (rows.length > 0) {
      const { error } = await db.from('dues_status').insert(rows);
      if (error) throw error;
    }
    return loadLedger();
  });
}
