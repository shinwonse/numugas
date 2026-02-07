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
import { usePitchingStatsBySeason } from '@/hooks/use-pitching-stats-by-season';
import { cn } from '@/lib/cn';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const SEASONS = ['통산', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

const COLUMNS = [
  { value: 'name', label: '선수명' },
  { value: 'games', label: '경기' },
  { value: 'era', label: '평균자책' },
  { value: 'wins', label: '승' },
  { value: 'losses', label: '패' },
  { value: 'saves', label: '세이브' },
  { value: 'holds', label: '홀드' },
  { value: 'winrate', label: '승률' },
  { value: 'innings', label: '이닝' },
  { value: 'batters', label: '타자' },
  { value: 'atbats', label: '타수' },
  { value: 'hits', label: '피안타' },
  { value: 'homeruns', label: '피홈런' },
  { value: 'sacrificehits', label: '희생번트' },
  { value: 'sacrificeflies', label: '희생플라이' },
  { value: 'walks', label: '볼넷' },
  { value: 'intentionalwalks', label: '고의4구' },
  { value: 'hitbypitch', label: '사구' },
  { value: 'strikeouts', label: '삼진' },
  { value: 'wildpitches', label: '폭투' },
  { value: 'balks', label: '보크' },
  { value: 'runs', label: '실점' },
  { value: 'earnedruns', label: '자책' },
  { value: 'whip', label: 'WHIP' },
  { value: 'opponent_avg', label: '피안타율' },
  { value: 'strikeout_rate', label: '탈삼진%' },
];

export default function PitcherStatsTable({ season }: { season: string }) {
  const { data, isLoading, error } = usePitchingStatsBySeason(
    season === '통산' ? undefined : season,
  );
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'games' | string>('games');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (search) {
      rows = rows.filter(
        (row: any) =>
          row.name?.toLowerCase().includes(search.toLowerCase()) ||
          row.team?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return sortData(rows, sortBy, sortOrder);
  }, [data, search, sortBy, sortOrder]);

  function sortData(rows: any[], sortBy: string, sortOrder: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      return 0;
    });
  }

  const handleHeaderClick = (colValue: string) => {
    if (sortBy === colValue) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colValue);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ colValue }: { colValue: string }) => {
    if (sortBy !== colValue) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-red-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-red-400" />
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls bar */}
      <div className="flex items-center justify-end gap-2">
          <Select
            value={season}
            onValueChange={(value) => router.push(`/stats/pitcher/${value}`)}
          >
            <SelectTrigger
              className={cn(
                'w-28 h-9 text-sm',
                'bg-white/[0.04] backdrop-blur-xl',
                'border-white/[0.06] hover:border-white/[0.12]',
                'rounded-xl transition-all duration-200',
                'cursor-pointer',
              )}
            >
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              className={cn(
                'w-44 h-9 text-sm pl-9',
                'bg-white/[0.04] backdrop-blur-xl',
                'border-white/[0.06] hover:border-white/[0.12] focus:border-red-500/40',
                'rounded-xl transition-all duration-200',
                'placeholder:text-gray-600',
              )}
              placeholder="선수명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
      </div>

      {/* Glass table card */}
      <div
        className={cn(
          'rounded-2xl overflow-hidden',
          'bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150',
          'border border-white/[0.06]',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]',
        )}
      >
        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="relative inline-flex">
                <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-red-500 animate-spin" />
              </div>
              <p className="mt-4 text-sm text-gray-600">불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-400 text-sm mb-1">오류가 발생했습니다</div>
              <p className="text-gray-600 text-sm">{error.message}</p>
            </div>
          ) : (
            <Table className="min-w-[600px] w-full">
              <TableHeader>
                <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                  {COLUMNS.map((col, idx) => (
                    <TableHead
                      key={col.value}
                      className={cn(
                        'whitespace-nowrap text-center cursor-pointer select-none',
                        'text-[11px] uppercase tracking-wider font-semibold',
                        'text-gray-600 hover:text-gray-300',
                        'transition-colors duration-200',
                        'h-10',
                        idx === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl',
                      )}
                      onClick={() => handleHeaderClick(col.value)}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        {col.label}
                        <SortIcon colValue={col.value} />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center py-12 text-gray-600 text-sm"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row: any, i: number) => (
                    <TableRow
                      key={row.name + row.season + i}
                      className={cn(
                        'border-b border-white/[0.03]',
                        'transition-colors duration-150',
                        'hover:bg-white/[0.03]',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]',
                      )}
                    >
                      {COLUMNS.map((col, idx) => {
                        const isHighlight = [
                          'name',
                          'era',
                          'wins',
                          'strikeouts',
                        ].includes(col.value);
                        const isName = col.value === 'name';
                        return (
                          <TableCell
                            key={col.value}
                            className={cn(
                              'whitespace-nowrap text-center text-sm',
                              isName
                                ? 'text-white font-semibold'
                                : isHighlight
                                  ? 'text-gray-200 font-medium'
                                  : 'text-gray-400',
                              idx === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl',
                            )}
                          >
                            {col.value === 'winrate' &&
                              typeof row[col.value] === 'number' ? (
                              row[col.value].toFixed(3)
                            ) : (
                              row[col.value]
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Result count */}
      {!isLoading && !error && (
        <div className="text-right">
          <span className="text-xs text-gray-600">
            총 {filtered.length}명
          </span>
        </div>
      )}
    </div>
  );
}
