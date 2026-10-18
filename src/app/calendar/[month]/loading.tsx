import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const WEEKS = 5;

export default function Loading() {
  return (
    <main
      className="mx-auto max-w-5xl px-4 pt-20 pb-32 text-white"
      aria-busy
      aria-label="일정을 불러오는 중"
    >
      <PageHeader eyebrow="Club Calendar" title="구단 캘린더" />

      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.06]" />
        <Skeleton className="h-7 w-32 rounded-lg bg-white/[0.08]" />
        <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.06]" />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/10">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-white/30">
                {day}
              </div>
            ))}
          </div>
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} className="grid grid-cols-7">
              {Array.from({ length: 7 }, (_, d) => (
                <div
                  key={d}
                  className="min-h-14 md:min-h-28 p-1 md:p-2 border-b border-r border-white/5 last:border-r-0 flex flex-col items-center md:items-stretch gap-1"
                >
                  <Skeleton
                    className="h-5 w-5 rounded-full bg-white/[0.06]"
                    style={{ animationDelay: `${(w * 7 + d) * 20}ms` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-2xl bg-white/[0.04]" />
      </div>
    </main>
  );
}
