'use client';

import { cn } from '@/lib/cn';
import {
  Database,
  KeyRound,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

type CrawlTarget = 'batter' | 'pitcher' | 'team' | 'schedule';

interface CrawlResult {
  success: boolean;
  message: string;
}

interface RefreshResponse {
  success: boolean;
  results: Record<string, CrawlResult>;
  revalidated: string[];
}

const TARGETS: { key: CrawlTarget; label: string }[] = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
  { key: 'team', label: '팀 기록' },
  { key: 'schedule', label: '경기 일정' },
];

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState<Set<CrawlTarget>>(
    new Set(),
  );
  const [results, setResults] = useState<Record<string, CrawlResult> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) {
      setIsAuthenticated(true);
      setError(null);
    }
  };

  const handleRefresh = async (targets?: CrawlTarget[]) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setLoadingTargets(new Set(targets ?? TARGETS.map((t) => t.key)));

    try {
      const res = await fetch('/api/admin/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, targets }),
      });

      const data: RefreshResponse | { error: string } = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setError('인증에 실패했습니다. 키를 다시 확인해주세요.');
        } else {
          setError('error' in data ? data.error : '알 수 없는 오류');
        }
        return;
      }

      if ('results' in data) {
        setResults(data.results);
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
      setLoadingTargets(new Set());
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div
            className={cn(
              'rounded-2xl p-8',
              'bg-white/5 backdrop-blur-xl',
              'border border-white/10',
            )}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-red-400" />
              </div>
              <h1 className="text-xl font-bold">관리자 인증</h1>
              <p className="text-sm text-gray-500 mt-1">
                관리자 키를 입력하세요
              </p>
            </div>

            <form onSubmit={handleAuth}>
              <div className="relative mb-4">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="ADMIN_SECRET"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder:text-gray-600',
                    'focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20',
                    'transition-all',
                  )}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm mb-4 text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className={cn(
                  'w-full py-3 rounded-xl font-medium',
                  'bg-red-500 hover:bg-red-600',
                  'transition-colors',
                )}
              >
                인증
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold uppercase tracking-[0.25em] text-red-400 mb-4">
            <Database className="w-3.5 h-3.5" />
            Admin Panel
          </div>
          <h1 className="text-3xl font-bold">데이터 관리</h1>
          <p className="text-gray-500 mt-2">
            크롤링을 실행하고 캐시를 갱신합니다
          </p>
        </div>

        {/* 전체 갱신 */}
        <button
          onClick={() => handleRefresh()}
          disabled={isLoading}
          className={cn(
            'w-full mb-6 p-5 rounded-2xl font-medium',
            'bg-gradient-to-r from-red-500 to-red-600',
            'hover:from-red-600 hover:to-red-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'flex items-center justify-center gap-3',
          )}
        >
          {isLoading && loadingTargets.size === TARGETS.length ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              전체 갱신 중...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              전체 데이터 갱신
            </>
          )}
        </button>

        {/* 개별 타겟 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {TARGETS.map((target) => {
            const result = results?.[target.key];
            const isTargetLoading = loadingTargets.has(target.key);

            return (
              <button
                key={target.key}
                onClick={() => handleRefresh([target.key])}
                disabled={isLoading}
                className={cn(
                  'p-4 rounded-xl text-left',
                  'bg-white/5 border border-white/10',
                  'hover:bg-white/10 hover:border-white/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200',
                  result?.success && 'border-green-500/30 bg-green-500/5',
                  result && !result.success && 'border-red-500/30 bg-red-500/5',
                )}
              >
                <div className="flex items-center justify-end mb-2">
                  {isTargetLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  {result?.success && (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  )}
                  {result && !result.success && (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-sm font-medium">{target.label}</p>
                {result && (
                  <p
                    className={cn(
                      'text-xs mt-1',
                      result.success ? 'text-green-400' : 'text-red-400',
                    )}
                  >
                    {result.message}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* 결과 */}
        {results && (
          <div
            className={cn(
              'rounded-xl p-4',
              'bg-white/5 border border-white/10',
            )}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              갱신 결과
            </h3>
            <div className="space-y-2">
              {Object.entries(results).map(([key, result]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-300">
                    {TARGETS.find((t) => t.key === key)?.label ?? key}
                  </span>
                  <span
                    className={
                      result.success ? 'text-green-400' : 'text-red-400'
                    }
                  >
                    {result.success ? '성공' : '실패'}
                  </span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">캐시 갱신</span>
                <span className="text-green-400">/, /players</span>
              </div>
            </div>
          </div>
        )}

        {error && !results && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
