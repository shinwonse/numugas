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

const SEASONS = ['통산', '2025', '2024', '2023', '2022', '2021', '2020'];

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
    <div className="pt-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl">시즌별 타자 기록</CardTitle>
          <div className="flex gap-2 w-full md:w-auto">
            <Select
              value={season}
              onValueChange={(value) => router.push(`/stats/batter/${value}`)}
            >
              <SelectTrigger className="w-28">
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
            <Input
              className="w-40"
              placeholder="선수명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            {isLoading ? (
              <div className="text-center py-12">불러오는 중...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                {error.message}
              </div>
            ) : (
              <Table className="min-w-[600px] w-full">
                <TableHeader>
                  <TableRow>
                    {COLUMNS.map((col) => (
                      <TableHead
                        key={col.value}
                        className="whitespace-nowrap text-center cursor-pointer select-none"
                        onClick={() => handleHeaderClick(col.value)}
                      >
                        {col.label}
                        <span style={{ marginLeft: 4 }}>
                          {getSortIcon(col.value)}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={COLUMNS.length}
                        className="text-center"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row: any, i: number) => (
                      <TableRow key={row.name + row.season + i}>
                        {COLUMNS.map((col) => (
                          <TableCell
                            key={col.value}
                            className="whitespace-nowrap text-center"
                          >
                            {row[col.value]}
                          </TableCell>
                        ))}
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
