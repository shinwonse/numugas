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
import { useBattingStats } from '@/hooks/use-batting-stats';
import { useMemo, useState } from 'react';

const SEASONS = ['2025', '2024', '2023', '2022', '2021', '2020'];

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

export default function BatterStatsPage() {
  const [season, setSeason] = useState(SEASONS[0]);
  const [search, setSearch] = useState('');
  const { data } = useBattingStats(season);
  console.log(data);

  // 검색 필터
  const filtered = useMemo(() => {
    if (!search) return data ?? [];
    return (data ?? []).filter(
      (row: any) =>
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.team?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <Card className="max-w-7xl mx-auto mt-10">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-2xl">시즌별 타자 기록</CardTitle>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={season} onValueChange={setSeason}>
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
            placeholder="선수명/팀 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-x-auto"
          style={{ minWidth: '900px', width: '100%' }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.value}
                    className="whitespace-nowrap text-center"
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} className="text-center">
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
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          총 {filtered.length}명의 선수 기록
        </div>
      </CardContent>
    </Card>
  );
}
