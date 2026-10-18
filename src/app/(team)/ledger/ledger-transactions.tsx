'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { todayKstKey } from '@/lib/calendar-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/cn';
import {
  formatWon,
  parseAmount,
  summarize,
  validateLedgerEntry,
  withRunningBalance,
} from '@/lib/ledger-utils';
import type { LedgerData, LedgerEntry, LedgerKind } from '@/types/ledger';
import { Loader2, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { deleteLedgerEntry, saveLedgerEntry } from './actions';
import type { LedgerSession } from './ledger-app';

type ActionResult =
  | { ok: true; data: LedgerData }
  | { ok: false; status: number; error: string };

const dialogClass =
  'max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-white/10 bg-[#0c0c10] text-white sm:rounded-2xl [&>button]:text-white/60';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20';

export function LedgerTransactions({
  session,
  isAdmin,
  onResult,
}: {
  session: LedgerSession;
  isAdmin: boolean;
  onResult: (result: ActionResult) => string | null;
}) {
  const { ledger } = session;
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<LedgerEntry | 'new' | null>(null);

  const rows = useMemo(
    () => withRunningBalance(ledger.openingBalance, ledger.entries),
    [ledger],
  );
  const balance = rows.length ? rows[rows.length - 1].balance : ledger.openingBalance;

  const thisMonth = todayKstKey().slice(0, 7);
  const monthSummary = summarize(
    ledger.entries.filter((e) => e.entry_date.startsWith(thisMonth)),
  );

  // 최신 월이 위로, 월 안에서도 최신 거래가 위로
  const months = useMemo(() => {
    const q = query.trim();
    const filtered = q
      ? rows.filter(
          (r) => r.counterparty.includes(q) || (r.memo ?? '').includes(q),
        )
      : rows;
    const map = new Map<string, typeof rows>();
    for (const row of [...filtered].reverse()) {
      const key = row.entry_date.slice(0, 7);
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map.entries()];
  }, [rows, query]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl md:col-span-1">
          <p className="text-xs text-white/50">현재 잔액</p>
          <p className="mt-1 text-2xl font-bold tabular-nums md:text-3xl">
            {formatWon(balance)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
          <p className="text-xs text-white/50">이번 달 입금</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-300">
            {formatWon(monthSummary.income)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
          <p className="text-xs text-white/50">이번 달 출금</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-rose-300">
            {formatWon(monthSummary.expense)}
          </p>
        </div>
      </section>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·내용 검색"
            aria-label="거래 검색"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-red-600"
          >
            <Plus className="h-4 w-4" />
            내역 추가
          </button>
        )}
      </div>

      {months.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-white/40">
          {query ? '검색 결과가 없습니다' : '거래 내역이 없습니다'}
        </p>
      ) : (
        <div className="space-y-6">
          {months.map(([month, monthRows]) => {
            const s = summarize(monthRows);
            return (
              <section key={month}>
                <div className="mb-2 flex items-baseline justify-between px-1">
                  <h3 className="text-sm font-semibold text-white/80">
                    {Number(month.slice(0, 4))}년 {Number(month.slice(5))}월
                  </h3>
                  <p className="text-xs tabular-nums text-white/40">
                    <span className="text-emerald-300/80">+{s.income.toLocaleString('ko-KR')}</span>
                    <span className="mx-1.5">/</span>
                    <span className="text-rose-300/80">-{s.expense.toLocaleString('ko-KR')}</span>
                  </p>
                </div>
                <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                  {monthRows.map((row) => {
                    const content = (
                      <>
                        <span className="w-10 shrink-0 text-xs tabular-nums text-white/40">
                          {Number(row.entry_date.slice(8))}일
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{row.counterparty}</span>
                          {row.memo && (
                            <span className="block truncate text-xs text-white/40">
                              {row.memo}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-right">
                          <span
                            className={cn(
                              'block text-sm font-semibold tabular-nums',
                              row.kind === 'income' ? 'text-emerald-300' : 'text-rose-300',
                            )}
                          >
                            {row.kind === 'income' ? '+' : '-'}
                            {row.amount.toLocaleString('ko-KR')}
                          </span>
                          <span className="block text-[11px] tabular-nums text-white/50">
                            {row.balance.toLocaleString('ko-KR')}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={row.id}>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => setEditing(row)}
                            aria-label={`${row.entry_date} ${row.counterparty} 수정`}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                          >
                            {content}
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {isAdmin && (
        <EntryDialog
          key={editing === 'new' ? 'new' : (editing?.id ?? 'closed')}
          editing={editing}
          secret={session.secret}
          onClose={() => setEditing(null)}
          onResult={onResult}
        />
      )}
    </div>
  );
}

function EntryDialog({
  editing,
  secret,
  onClose,
  onResult,
}: {
  editing: LedgerEntry | 'new' | null;
  secret: string;
  onClose: () => void;
  onResult: (result: ActionResult) => string | null;
}) {
  const existing = editing && editing !== 'new' ? editing : null;
  const [date, setDate] = useState(existing?.entry_date ?? todayKstKey());
  const [kind, setKind] = useState<LedgerKind>(existing?.kind ?? 'income');
  const [amount, setAmount] = useState(existing ? existing.amount.toLocaleString('ko-KR') : '');
  const [counterparty, setCounterparty] = useState(existing?.counterparty ?? '');
  const [memo, setMemo] = useState(existing?.memo ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = { entry_date: date, kind, amount: parseAmount(amount), counterparty, memo };
    const parsed = validateLedgerEntry(input);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const failure = onResult(await saveLedgerEntry(secret, existing?.id ?? null, input));
      if (failure) setError(failure);
      else onClose();
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    setSaving(true);
    try {
      const failure = onResult(await deleteLedgerEntry(secret, existing.id));
      if (failure) {
        setError(failure);
        setConfirmDelete(false);
      } else onClose();
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={editing !== null} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>{existing ? '내역 수정' : '내역 추가'}</DialogTitle>
            <DialogDescription className="text-white/50">
              잔액은 날짜 순서대로 자동 계산됩니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => void submit(e)} className="space-y-4">
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              {(
                [
                  ['income', '입금'],
                  ['expense', '출금'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={kind === value}
                  onClick={() => setKind(value)}
                  className={cn(
                    'cursor-pointer rounded-lg py-2 text-sm font-semibold transition-colors',
                    kind === value
                      ? value === 'income'
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-rose-500/20 text-rose-200'
                      : 'text-white/40 hover:text-white/80',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-400">날짜</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-400">금액 (원)</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="numeric"
                  placeholder="30,000"
                  className={cn(inputClass, 'tabular-nums')}
                  autoFocus
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-400">
                내용 (입금자/출금처)
              </span>
              <input
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="예: 신원세"
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-400">비고 (선택)</span>
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 3분기 회비"
                className={inputClass}
              />
            </label>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              {existing && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={saving}
                  className="cursor-pointer rounded-xl border border-red-500/30 px-4 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                  삭제
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-medium transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {existing ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={(open) => !saving && setConfirmDelete(open)}>
        <AlertDialogContent className={dialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle>내역을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {existing
                ? `${existing.entry_date} ${existing.counterparty} ${formatWon(existing.amount)}`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={saving}
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                void remove();
              }}
              className="rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
