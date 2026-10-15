import { Skeleton } from '@/components/ui/skeleton';

export function StatsSectionSkeleton() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Skeleton className="h-4 w-40 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-8 w-56 mx-auto bg-white/10" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 md:h-36 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlayerStatsSectionSkeleton() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Skeleton className="h-4 w-48 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
        </div>
        <div className="flex gap-2 mb-12">
          <Skeleton className="h-10 w-28 rounded-full bg-white/10" />
          <Skeleton className="h-10 w-28 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TotalStatsSectionSkeleton() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Skeleton className="h-4 w-40 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-8 w-56 mx-auto bg-white/10" />
        </div>
        <div className="flex gap-2 mb-12">
          <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
          <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
