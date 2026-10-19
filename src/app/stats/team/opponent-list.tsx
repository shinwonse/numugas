'use client';

import { RESULT_STYLES } from '@/lib/calendar-styles';
import { toKstDateKey } from '@/lib/calendar-utils';
import { cn } from '@/lib/cn';
import type { OpponentRecord } from '@/lib/fetchers/opponents';
import { formatWinLoss } from '@/lib/opponents';
import { ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const formatDate = (iso: string) => toKstDateKey(iso).replaceAll('-', '.');

/** 우세/열세/동률에 따라 전적 글자색 */
function recordTone(r: OpponentRecord) {
  if (r.win > r.lose) return 'text-emerald-300';
  if (r.win < r.lose) return 'text-rose-300';
  return 'text-white/70';
}

export function OpponentListFromParams({ records }: { records: OpponentRecord[] }) {
  const team = useSearchParams().get('team');
  return <OpponentList records={records} initialTeam={team} />;
}

export function OpponentList({
  records,
  initialTeam = null,
}: {
  records: OpponentRecord[];
  /** 이 팀으로 검색하고 펼친 상태로 시작한다 (경기 상세의 "전체 보기") */
  initialTeam?: string | null;
}) {
  const [query, setQuery] = useState(initialTeam ?? '');
  const [openTeam, setOpenTeam] = useState<string | null>(initialTeam);
  const openRowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (initialTeam) {
      openRowRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [initialTeam]);

  const keyword = query.trim().toLowerCase();
  const filtered = keyword
    ? records.filter((r) => r.opponent.toLowerCase().includes(keyword))
    : records;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="팀 이름 검색"
          aria-label="팀 이름 검색"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-10 text-base text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 md:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
            }}
            aria-label="검색어 지우기"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/[0.08] bg-white/[0.03] py-12 text-center text-sm text-white/50">
          {records.length === 0 ? '아직 끝난 경기가 없습니다.' : '검색 결과가 없습니다.'}
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
          {filtered.map((record, index) => {
            const isOpen = openTeam === record.opponent;
            const panelId = `opponent-panel-${String(index)}`;
            return (
              <li key={record.opponent} ref={isOpen ? openRowRef : undefined}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    setOpenTeam(isOpen ? null : record.opponent);
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none md:px-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-white">
                      {record.opponent}
                    </span>
                    <span className="mt-0.5 block text-xs tabular-nums text-white/45">
                      {record.games}경기 · 득 {record.runsFor} / 실 {record.runsAgainst}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold tabular-nums',
                      recordTone(record),
                    )}
                  >
                    {formatWinLoss(record)}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'h-4 w-4 shrink-0 text-white/30 transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>

                {isOpen && (
                  <ol id={panelId} className="space-y-1 px-2 pb-3 md:px-3">
                    {record.matches.map((match) => (
                      <li key={match.id}>
                        <Link
                          href={`/calendar/event/${match.id}`}
                          className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-white/[0.05] md:px-3"
                        >
                          <span className="w-20 shrink-0 tabular-nums text-white/60">
                            {formatDate(match.startsAt)}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs text-white/40">
                            {match.category}
                          </span>
                          <span
                            className={cn(
                              'shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums',
                              RESULT_STYLES[match.result],
                            )}
                          >
                            {match.result} {match.ours}:{match.theirs}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
