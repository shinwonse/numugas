'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useBattingStatsBySeason } from '@/hooks/use-batting-stats-by-season';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const SEASONS = ['통산', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

const COLUMNS = [
  { value: 'name', label: '선수명' },
  { value: 'games', label: '경기' },
  { value: 'avg', label: '타율' },
  { value: 'plateappearances', label: '타석' },
  { value: 'atbats', label: '타수' },
  { value: 'runs', label: '득점' },
  { value: 'hits', label: '안타' },
  { value: 'singles', label: '1루타' },
  { value: 'doubles', label: '2루타' },
  { value: 'triples', label: '3루타' },
  { value: 'homeruns', label: '홈런' },
  { value: 'totalbases', label: '루타' },
  { value: 'rbi', label: '타점' },
  { value: 'stolenbases', label: '도루' },
  { value: 'caughtstealing', label: '도루자' },
  { value: 'sacrificehits', label: '희생번트' },
  { value: 'sacrificeflies', label: '희생플라이' },
  { value: 'walks', label: '볼넷' },
  { value: 'intentionalwalks', label: '고의4구' },
  { value: 'hitbypitch', label: '사구' },
  { value: 'strikeouts', label: '삼진' },
  { value: 'doubleplays', label: '병살타' },
  { value: 'sluggingpercentage', label: '장타율' },
  { value: 'onbasepercentage', label: '출루율' },
];

export default function BatterStatsTable({ season }: { season: string }) {
  const { data, isLoading, error } = useBattingStatsBySeason(
    season === '통산' ? undefined : season,
  );
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'plateappearances' | string>(
    'plateappearances',
  );
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

  const getSortIcon = (colValue: string) => {
    if (sortBy !== colValue) return null;
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="w-full">
      <Card className="bg-black/40 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader className="border-b border-white/5 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                {season === '통산' ? '통산' : `${season} 시즌`} 타자 기록
              </CardTitle>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Select
                  value={season}
                  onValueChange={(value) =>
                    router.push(`/stats/batter/${value}`)
                  }
                >
                  <SelectTrigger className="w-32 bg-black/60 border-white/10 hover:border-red-500/50 transition-colors">
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
              </div>

              <div className="relative">
                <Input
                  className="w-48 bg-black/60 border-white/10 hover:border-red-500/50 focus:border-red-500 transition-colors pl-10"
                  placeholder="선수명 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 text-lg mb-2">⚠️ 오류 발생</div>
                <p className="text-gray-400">{error.message}</p>
              </div>
            ) : (
              <Table className="min-w-[600px] w-full">
                <TableHeader>
                  <TableRow className="border-b border-white/5 hover:bg-transparent">
                    {COLUMNS.map((col, idx) => (
                      <TableHead
                        key={col.value}
                        className={`whitespace-nowrap text-center cursor-pointer select-none transition-colors text-gray-400 hover:text-white ${idx === 0 ? 'sticky left-0 z-10 bg-black/80 backdrop-blur-sm' : ''}`}
                        onClick={() => handleHeaderClick(col.value)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {col.label}
                          {getSortIcon(col.value) && (
                            <span className="text-red-500">
                              {getSortIcon(col.value)}
                            </span>
                          )}
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
                        className="text-center py-12 text-gray-400"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row: any, i: number) => (
                      <TableRow
                        key={row.name + row.season + i}
                        className="border-b border-white/5 hover:bg-red-500/5 transition-colors"
                      >
                        {COLUMNS.map((col, idx) => {
                          const isHighlight = [
                            'name',
                            'avg',
                            'homeruns',
                            'rbi',
                          ].includes(col.value);
                          return (
                            <TableCell
                              key={col.value}
                              className={`whitespace-nowrap text-center ${
                                isHighlight
                                  ? 'text-white font-medium'
                                  : 'text-gray-300'
                              } ${idx === 0 ? 'sticky left-0 z-10 bg-black/80 backdrop-blur-sm' : ''}`}
                            >
                              {row[col.value]}
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
        </CardContent>
      </Card>
    </div>
  );
}
