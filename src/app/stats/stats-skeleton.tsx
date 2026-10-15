import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';

const SKELETON_ROWS = 10;

/** 표 본문 자리에 넣는 스켈레톤 행 (헤더/컬럼 폭은 실제 표를 그대로 사용) */
export function StatsTableRowsSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <TableRow
          key={row}
          className="border-b border-white/[0.03] hover:bg-transparent"
          aria-hidden
        >
          {Array.from({ length: columns }, (_, col) => (
            <TableCell
              key={col}
              className={cn(
                'py-3',
                col === 0 && 'sticky left-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl',
              )}
            >
              <Skeleton
                className={cn(
                  'mx-auto h-4 rounded bg-white/[0.06]',
                  col === 0 ? 'w-14' : 'w-7',
                )}
                style={{ animationDelay: `${row * 60}ms` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/**
 * loading.tsx용: 헤더는 레이아웃에 남아 있으므로 필터 + 표 자리만 그린다.
 * (다른 페이지에서 /stats로 처음 들어올 때 보인다)
 */
export function StatsContentSkeleton() {
  return (
    <div className="w-full space-y-4" aria-busy aria-label="기록을 불러오는 중">
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-9 w-28 rounded-xl bg-white/[0.05]" />
        <Skeleton className="h-9 w-28 rounded-xl bg-white/[0.05]" />
        <Skeleton className="h-9 w-44 rounded-xl bg-white/[0.05]" />
      </div>
      <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
        <div className="h-10 border-b border-white/[0.04]" />
        <div className="divide-y divide-white/[0.03]">
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3.5">
              <Skeleton
                className="h-4 w-14 rounded bg-white/[0.07]"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <Skeleton
                className="h-4 flex-1 rounded bg-white/[0.04]"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
