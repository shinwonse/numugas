'use client';

import { cn } from '@/lib/cn';
import {
  DUES_STATUS_LABELS,
  type DuesRow,
  type DuesStatus,
  type LedgerData,
} from '@/types/ledger';
import { Loader2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { addDuesMember, setDuesStatus, startDuesYear } from './actions';
import type { LedgerSession } from './ledger-app';

type ActionResult =
  | { ok: true; data: LedgerData }
  | { ok: false; status: number; error: string };

const STATUS_STYLES: Record<DuesStatus, string> = {
  paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  dormant: 'bg-white/5 text-white/40 border-white/10',
  unpaid: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

// 클릭할 때마다 납부 → 휴면 → 미납 순으로 바뀐다
const NEXT_STATUS: Record<DuesStatus, DuesStatus> = {
  paid: 'dormant',
  dormant: 'unpaid',
  unpaid: 'paid',
};

const QUARTERS = [1, 2, 3, 4] as const;

export function LedgerDues({
  session,
  isAdmin,
  onResult,
}: {
  session: LedgerSession;
  isAdmin: boolean;
  onResult: (result: ActionResult) => string | null;
}) {
  const { dues } = session.ledger;
  const years = useMemo(
    () => [...new Set(dues.map((d) => d.year))].sort((a, b) => b - a),
    [dues],
  );
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
  const [pendingCell, setPendingCell] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const members = useMemo(() => {
    const map = new Map<string, { name: string; order: number; statuses: Partial<Record<number, DuesRow>> }>();
    for (const row of dues.filter((d) => d.year === year)) {
      const entry = map.get(row.member_name) ?? { name: row.member_name, order: row.sort_order, statuses: {} };
      entry.statuses[row.quarter] = row;
      map.set(row.member_name, entry);
    }
    return [...map.values()].sort((a, b) => a.order - b.order);
  }, [dues, year]);

  const counts = QUARTERS.map((q) => {
    const c: Record<DuesStatus, number> = { paid: 0, dormant: 0, unpaid: 0 };
    for (const m of members) {
      const s = m.statuses[q]?.status;
      if (s) c[s] += 1;
    }
    return c;
  });

  const run = async (fn: () => Promise<ActionResult>) => {
    setError(null);
    try {
      const failure = onResult(await fn());
      if (failure) setError(failure);
      return !failure;
    } catch {
      setError('서버 연결에 실패했습니다.');
      return false;
    }
  };

  const toggle = async (name: string, quarter: number, current: DuesStatus) => {
    const key = `${name}-${quarter}`;
    setPendingCell(key);
    await run(() => setDuesStatus(session.secret, year, name, quarter, NEXT_STATUS[current]));
    setPendingCell(null);
  };

  const addMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    if (await run(() => addDuesMember(session.secret, year, newName))) setNewName('');
    setBusy(false);
  };

  const nextYear = (years[0] ?? year) + 1;
  const startYear = async () => {
    if (!window.confirm(`${nextYear}년 회비 명단을 ${nextYear - 1}년 명단으로 시작할까요?`)) return;
    setBusy(true);
    if (await run(() => startDuesYear(session.secret, nextYear))) setYear(nextYear);
    setBusy(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="연도"
          className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-black">
              {y}년
            </option>
          ))}
        </select>
        {isAdmin && (
          <button
            type="button"
            onClick={() => void startYear()}
            disabled={busy}
            className="ml-auto cursor-pointer rounded-xl px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            {nextYear}년 시작
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs text-white/50">
              <th className="px-4 py-3 text-left font-medium">이름</th>
              {QUARTERS.map((q) => (
                <th key={q} className="px-1 py-3 font-medium">
                  {q}분기
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {members.map((m) => (
              <tr key={m.name}>
                <td className="px-4 py-2.5 font-medium">{m.name}</td>
                {QUARTERS.map((q) => {
                  const status = m.statuses[q]?.status ?? 'unpaid';
                  const key = `${m.name}-${q}`;
                  const chip = (
                    <span
                      className={cn(
                        'inline-flex min-h-9 min-w-11 items-center justify-center rounded-lg border px-2 py-1.5 text-xs font-medium',
                        STATUS_STYLES[status],
                      )}
                    >
                      {pendingCell === key ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        DUES_STATUS_LABELS[status]
                      )}
                    </span>
                  );
                  return (
                    <td key={q} className="px-1 py-1.5 text-center">
                      {isAdmin ? (
                        <button
                          type="button"
                          disabled={pendingCell !== null}
                          onClick={() => void toggle(m.name, q, status)}
                          aria-label={`${m.name} ${q}분기 ${DUES_STATUS_LABELS[status]}, 눌러서 변경`}
                          className="min-h-11 cursor-pointer rounded-lg p-1 transition-opacity hover:opacity-80 disabled:cursor-wait"
                        >
                          {chip}
                        </button>
                      ) : (
                        chip
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-white/[0.06] text-[11px] text-white/50">
            {(['paid', 'dormant', 'unpaid'] as const).map((s) => (
              <tr key={s}>
                <td className="px-4 py-1.5">{DUES_STATUS_LABELS[s]}</td>
                {counts.map((c, i) => (
                  <td key={i} className="px-1 py-1.5 text-center tabular-nums">
                    {c[s]}명
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      {isAdmin && (
        <form onSubmit={(e) => void addMember(e)} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`${year}년 명단에 추가할 이름`}
            aria-label="추가할 이름"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-red-500/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !newName.trim()}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 text-sm transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            추가
          </button>
        </form>
      )}
    </div>
  );
}
