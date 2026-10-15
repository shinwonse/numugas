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

/** /stats 진입·타입 전환 시 loading.tsx에서 쓰는 전체 페이지 스켈레톤 */
export function StatsPageSkeleton() {
  return (
    <main
      className="flex flex-col pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen"
      aria-busy
      aria-label="기록을 불러오는 중"
    >
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 md:mb-14">
          <Skeleton className="mb-5 h-8 w-48 rounded-full bg-white/[0.06]" />
          <Skeleton className="mb-3 h-10 md:h-14 w-64 md:w-80 rounded-xl bg-white/[0.08]" />
          <Skeleton className="mb-8 h-4 w-56 rounded bg-white/[0.05]" />
          <div className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          <Skeleton className="h-11 w-full max-w-sm rounded-2xl bg-white/[0.05]" />
        </div>

        {/* Controls */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-28 rounded-xl bg-white/[0.05]" />
          <Skeleton className="h-9 w-28 rounded-xl bg-white/[0.05]" />
          <Skeleton className="h-9 w-44 rounded-xl bg-white/[0.05]" />
        </div>

        {/* Table */}
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
    </main>
  );
}
