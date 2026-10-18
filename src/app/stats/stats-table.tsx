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
import { StatsTableRowsSkeleton } from './stats-skeleton';
import { useStatsNavigation } from './use-stats-navigation';

const SEASONS = getStatsSeasons();

const selectTriggerClass = cn(
  'flex-1 sm:flex-none sm:w-28 h-10 text-sm',
  'bg-white/[0.04] backdrop-blur-xl',
  'border-white/[0.06] hover:border-white/[0.12]',
  'rounded-xl transition-all duration-200',
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

  return (
    <div className="w-full space-y-4">
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
              'rounded-xl transition-all duration-200',
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
          'rounded-2xl overflow-hidden transition-opacity duration-200',
          isPending && !showSkeleton && 'opacity-60',
          'bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150',
          'border border-white/[0.06]',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]',
        )}
      >
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[600px] w-full">
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
                        'h-10 p-0',
                        idx === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl',
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
                          active ? 'text-white' : 'text-white/50 hover:text-white',
                          'transition-colors duration-200',
                        )}
                      >
                        {col.label}
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
            <TableBody aria-busy={isPending}>
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
                    key={`${String(row.name)}-${String(row.season)}-${i}`}
                    className={cn(
                      'border-b border-white/[0.03]',
                      'transition-colors duration-150',
                      'hover:bg-white/[0.03]',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]',
                    )}
                  >
                    {columns.map((col, idx) => {
                      const isName = col.value === 'name';
                      const value = row[col.value];
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
                            idx === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl',
                          )}
                        >
                          {format ? format(col.value, value) : (value as string | number)}
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
