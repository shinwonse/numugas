export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-800 rounded-lg mb-4 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded-lg w-1/3 mx-auto animate-pulse" />
        </div>

        {/* Player info skeleton */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Photo skeleton */}
            <div className="w-48 h-48 bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />

            {/* Info skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-800 rounded-lg w-1/2 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded-lg w-1/3 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded-lg w-1/4 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-12 bg-gray-800 rounded-lg w-24 animate-pulse" />
          <div className="h-12 bg-gray-800 rounded-lg w-24 animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="bg-gray-900 rounded-2xl p-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
