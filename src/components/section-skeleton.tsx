import { Skeleton } from '@/components/ui/skeleton';

export function StatsSectionSkeleton() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="page-container">
        <div className="mb-14">
          <Skeleton className="h-4 w-40 mb-4 bg-white/10" />
          <Skeleton className="h-10 w-56 bg-white/10" />
        </div>
        <Skeleton className="h-64 rounded-lg bg-white/5" />
        <Skeleton className="mt-4 h-56 rounded-lg bg-white/5" />
      </div>
    </section>
  );
}

export function PlayerStatsSectionSkeleton() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="page-container">
        <div className="mb-14">
          <Skeleton className="h-4 w-48 mb-4 bg-white/10" />
          <Skeleton className="h-10 w-64 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 rounded-lg bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TotalStatsSectionSkeleton() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="page-container">
        <div className="mb-14">
          <Skeleton className="h-4 w-40 mb-4 bg-white/10" />
          <Skeleton className="h-10 w-56 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 rounded-lg bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
