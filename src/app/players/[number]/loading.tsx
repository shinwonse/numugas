import { SectionBackground } from '@/components/animated/section-background';

export default function Loading() {
  return (
    <main className="relative min-h-screen bg-black text-white py-8 md:py-16 px-4 sm:px-8 md:px-16 lg:px-32 overflow-hidden">
      <SectionBackground variant="dots" />

      {/* Player Header Skeleton */}
      <div
        className="relative z-10 w-full mb-12"
        style={{ animation: 'fade-in-only 0.3s ease forwards' }}
      >
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto relative">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full animate-pulse border-4 border-red-500/30" />
            </div>
            <div className="flex flex-col justify-center items-center md:items-start flex-1 text-center md:text-left space-y-4">
              <div className="h-12 md:h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl w-full max-w-md animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div
        className="relative z-10 w-full mb-8"
        style={{ animation: 'fade-in-only 0.3s ease 0.1s both' }}
      >
        <div className="flex justify-center">
          <div className="flex bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1.5 shadow-xl gap-2">
            <div className="h-14 w-36 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl animate-pulse" />
            <div className="h-14 w-36 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        style={{ animation: 'fade-in-only 0.3s ease 0.2s both' }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-red-950/40 to-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6"
          >
            <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg mb-3 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded w-20 mx-auto animate-pulse" />
          </div>
        ))}
      </div>

      {/* Stats Table Skeleton */}
      <div
        className="relative z-10 w-full space-y-8"
        style={{ animation: 'fade-in-only 0.3s ease 0.3s both' }}
      >
        <div className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-8">
          <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg w-48 mx-auto mb-6 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-8">
          <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg w-48 mx-auto mb-6 animate-pulse" />
          <div className="h-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg animate-pulse" />
        </div>
      </div>
    </main>
  );
}
