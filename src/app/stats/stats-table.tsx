'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/cn';
import {
  LEAGUES,
  LEAGUE_LABELS,
  getLeaguesForSeason,
  type League,
} from '@/lib/leagues';
import { CAREER_SEASON, getStatsSeasons } from '@/lib/seasons';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { STATS_TABLES, type StatsType } from './stats-columns';
import { StatsLeaders } from './stats-leaders';
import { StatsTableRowsSkeleton } from './stats-skeleton';
import { useStatsNavigation } from './use-stats-navigation';

const SEASONS = getStatsSeasons();

const selectTriggerClass = cn(
  'flex-1 sm:flex-none sm:w-28 h-10 text-sm',
  'bg-white/[0.04] backdrop-blur-xl',
  'border-white/[0.06] hover:border-white/[0.12]',
  'rounded-md transition-all duration-200',
  'cursor-pointer',
);

type Row = Record<string, unknown>;

function sortRows(rows: Row[], sortBy: string, sortOrder: 'asc' | 'desc') {
  return [...rows].sort((a, b) => {
    if (sortBy === 'name') {
      const aS = String(a[sortBy] ?? '');
      const bS = String(b[sortBy] ?? '');
      return sortOrder === 'asc' ? aS.localeCompare(bS) : bS.localeCompare(aS);
    }
    const aN = Number(a[sortBy]);
    const bN = Number(b[sortBy]);
    const aV = Number.isFinite(aN) ? aN : -Infinity;
    const bV = Number.isFinite(bN) ? bN : -Infinity;
    return sortOrder === 'asc' ? aV - bV : bV - aV;
  });
}

/** 타자/투수 기록 표 (시즌·리그 선택, 이름 검색, 열 정렬) */
export function StatsTable({
  type,
  season,
  league,
  initialData,
}: {
  type: StatsType;
  season: string;
  league: League | undefined;
  initialData: Row[];
}) {
  const { columns, defaultSort, highlight, format } = STATS_TABLES[type];
  const availableLeagues: League[] =
    season === CAREER_SEASON ? [...LEAGUES] : getLeaguesForSeason(season);
  const {
    isPending,
    showSkeleton,
    shownSeason,
    shownLeague,
    changeSeason,
    changeLeague,
  } = useStatsNavigation(type, season, league);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const rows = query
      ? initialData.filter(
          (row) =>
            String(row.name ?? '').toLowerCase().includes(query) ||
            String(row.team ?? '').toLowerCase().includes(query),
        )
      : initialData;
    return sortRows(rows, sortBy, sortOrder);
  }, [initialData, search, sortBy, sortOrder]);

  const handleSort = (colValue: string) => {
    if (sortBy === colValue) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colValue);
      setSortOrder('desc');
    }
  };

  // 숫자 열을 내림차순으로 볼 때만 상위 3명을 순위 색으로 강조한다
  const showPodium = sortBy !== 'name' && sortOrder === 'desc' && !search;

  return (
    <div className="w-full space-y-4">
      {!showSkeleton && <StatsLeaders type={type} rows={initialData} />}

      {/* 모바일: 검색이 한 줄을 차지하고 아래에 시즌·리그 / sm 이상: 한 줄 */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Select value={shownSeason} onValueChange={changeSeason}>
          <SelectTrigger className={selectTriggerClass} aria-label="시즌">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEASONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {availableLeagues.length > 0 && (
          <Select value={shownLeague} onValueChange={changeLeague}>
            <SelectTrigger className={selectTriggerClass} aria-label="리그">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 리그</SelectItem>
              {availableLeagues.map((l) => (
                <SelectItem key={l} value={l}>
                  {LEAGUE_LABELS[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="relative order-first w-full sm:order-none sm:w-44">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            className={cn(
              'w-full h-10 text-sm pl-9',
              'bg-white/[0.04] backdrop-blur-xl',
              'border-white/[0.06] hover:border-white/[0.12] focus:border-red-500/40',
              'rounded-md transition-all duration-200',
              'placeholder:text-gray-500',
            )}
            placeholder="선수명 검색"
            aria-label="선수명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div
        className={cn(
          // 모바일은 가로로 넘기는 표라 좌우 여백(20px)까지 펼쳐 한 열이라도 더 보이게 한다
          '-mx-5 sm:mx-0 sm:rounded-lg overflow-hidden transition-opacity duration-200',
          isPending && !showSkeleton && 'opacity-60',
          'bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150',
          'border-y border-white/[0.06] sm:border-x',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]',
        )}
      >
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[600px] w-full tabular-nums">
            <TableHeader>
              <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                {columns.map((col, idx) => {
                  const active = sortBy === col.value;
                  return (
                    <TableHead
                      key={col.value}
                      aria-sort={
                        active
                          ? sortOrder === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      className={cn(
                        'relative h-11 p-0 transition-colors duration-300',
                        active && 'bg-red-500/[0.08]',
                        idx === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleSort(col.value);
                        }}
                        className={cn(
                          'flex h-full w-full cursor-pointer items-center justify-center gap-0.5 whitespace-nowrap px-3',
                          'text-[11px] uppercase tracking-wider font-semibold',
                          active ? 'text-red-300' : 'text-white/50 hover:text-white',
                          'transition-colors duration-200',
                        )}
                      >
                        {col.label}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute inset-x-2 bottom-0 h-0.5 bg-red-500"
                            style={{ animation: 'scale-in-x 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                          />
                        )}
                        {active &&
                          (sortOrder === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-red-400" />
                          ))}
                      </button>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            {/* 정렬이 바뀌면 본문을 다시 그려 행 등장 애니메이션을 재생한다 */}
            <TableBody key={`${sortBy}-${sortOrder}`} aria-busy={isPending}>
              {showSkeleton ? (
                <StatsTableRowsSkeleton columns={columns.length} />
              ) : filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-12 text-white/50 text-sm"
                  >
                    {search ? '검색 결과가 없습니다.' : '기록이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row, i) => (
                  <TableRow
                    key={`${String(row.name)}-${String(row.season)}-${String(i)}`}
                    className={cn(
                      'group border-b border-white/[0.03]',
                      'transition-colors duration-150',
                      'hover:bg-red-500/[0.05]',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]',
                    )}
                    style={{
                      animation: `row-in 0.35s ease-out ${String(Math.min(i, 15) * 0.025)}s both`,
                    }}
                  >
                    {columns.map((col, idx) => {
                      const isName = col.value === 'name';
                      const value = row[col.value];
                      const display = format ? format(col.value, value) : (value as string | number);
                      return (
                        <TableCell
                          key={col.value}
                          className={cn(
                            'whitespace-nowrap text-center text-sm',
                            isName
                              ? 'text-white font-semibold'
                              : highlight.includes(col.value)
                                ? 'text-gray-200 font-medium'
                                : 'text-gray-400',
                            sortBy === col.value && 'bg-red-500/[0.06] font-bold text-white',
                            idx === 0 &&
                              'sticky left-0 z-10 bg-[#0a0a0f] text-left group-hover:bg-[#140a0c]',
                          )}
                        >
                          {isName ? (
                            <span className="flex items-center gap-2.5">
                              <span
                                className={cn(
                                  'w-5 text-right text-[11px] font-bold',
                                  showPodium && i < 3 ? 'text-red-400' : 'text-white/30',
                                )}
                              >
                                {i + 1}
                              </span>
                              {display}
                            </span>
                          ) : (
                            display
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xs text-white/50">
          {showSkeleton ? '불러오는 중' : `총 ${filtered.length}명`}
        </span>
      </div>
    </div>
  );
}
