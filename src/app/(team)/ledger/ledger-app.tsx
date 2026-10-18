'use client';

import { cn } from '@/lib/cn';
import type { AccessRole } from '@/lib/access-guard';
import type { LedgerData } from '@/types/ledger';
import { KeyRound, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { openLedger } from './actions';
import { LedgerDues } from './ledger-dues';
import { LedgerTransactions } from './ledger-transactions';

export interface LedgerSession {
  secret: string;
  role: AccessRole;
  ledger: LedgerData;
}

type Tab = 'transactions' | 'dues';

/**
 * 회계 장부. 들어올 때마다 비밀번호를 받고, 그 비밀번호로 권한이 정해진다.
 * (팀 비밀번호: 열람 전용, 관리자 키: 수정 가능) 비밀번호는 저장하지 않는다.
 */
export function LedgerApp() {
  const [session, setSession] = useState<LedgerSession | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('transactions');

  const unlock = useCallback(async (secret: string) => {
    setChecking(true);
    setError(null);
    try {
      const result = await openLedger(secret);
      if (result.ok) {
        setSession({ secret, role: result.data.role, ledger: result.data.ledger });
      } else {
        setError(result.error);
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setChecking(false);
    }
  }, []);

  /** 수정 결과(최신 장부)를 반영. 권한 오류면 잠근다 */
  const applyResult = useCallback(
    (result: { ok: true; data: LedgerData } | { ok: false; status: number; error: string }) => {
      if (result.ok) {
        setSession((prev) => (prev ? { ...prev, ledger: result.data } : prev));
        return null;
      }
      if (result.status === 401) {
        setSession(null);
        setError(result.error);
      }
      return result.error;
    },
    [],
  );

  if (!session) {
    return <UnlockForm checking={checking} error={error} onSubmit={unlock} />;
  }

  const isAdmin = session.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1">
          {(
            [
              ['transactions', '거래내역'],
              ['dues', '회비'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                'cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold transition-colors',
                tab === key
                  ? 'bg-white/[0.12] text-white'
                  : 'text-white/40 hover:text-white/80',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'transactions' ? (
        <LedgerTransactions
          session={session}
          isAdmin={isAdmin}
          onResult={applyResult}
        />
      ) : (
        <LedgerDues session={session} isAdmin={isAdmin} onResult={applyResult} />
      )}
    </div>
  );
}

function UnlockForm({
  checking,
  error,
  onSubmit,
}: {
  checking: boolean;
  error: string | null;
  onSubmit: (secret: string) => Promise<void>;
}) {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) void onSubmit(value.trim());
      }}
      className="mx-auto max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <p className="text-center text-sm text-white/60">
        팀원 비밀번호를 입력하면 장부를 볼 수 있어요.
      </p>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="비밀번호"
          aria-label="비밀번호"
          autoComplete="off"
          autoFocus
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20"
        />
      </div>
      {error && (
        <p className="text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={checking || !value.trim()}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-medium transition-colors hover:bg-red-600 disabled:opacity-50"
      >
        {checking && <Loader2 className="h-4 w-4 animate-spin" />}
        열기
      </button>
    </form>
  );
}
