export default function Loading() {
  return (
    <main
      className="relative min-h-screen bg-[#050508] text-white overflow-x-clip"
      aria-busy
      aria-label="선수 정보를 불러오는 중"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative h-[64vh] min-h-[420px] w-full animate-pulse bg-white/[0.04] lg:sticky lg:top-0 lg:h-dvh">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
        </div>

        <div className="-mt-28 px-4 pb-16 sm:px-8 lg:mt-0 lg:px-12 lg:pt-20 xl:px-16">
          <div className="relative mb-8 space-y-3">
            <div className="h-3 w-32 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.1] md:h-12" />
            <div className="mt-6 h-11 w-40 animate-pulse rounded-2xl bg-white/[0.05]" />
          </div>
          <div className="space-y-5">
            <div className="h-36 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
            <div className="h-14 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
          </div>
        </div>
      </div>
    </main>
  );
}
