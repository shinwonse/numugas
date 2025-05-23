import { notFound } from 'next/navigation';
import StatsTableClient from './StatsTableClient';

const SEASONS = ['통산', '2025', '2024', '2023', '2022', '2021', '2020'];
const TYPES = [
  { key: 'batter', label: '타자 기록' },
  { key: 'pitcher', label: '투수 기록' },
];

export async function generateStaticParams() {
  return TYPES.flatMap((type) =>
    SEASONS.map((season) => ({ type: type.key, season })),
  );
}

export default function StatsTypeSeasonPage({
  params,
}: {
  params: { type: string; season: string };
}) {
  const { type, season } = params;
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  return (
    <main className="flex flex-col gap-0 bg-background ">
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row items-center gap-4 rounded-xl border bg-white/80 dark:bg-zinc-900/80 shadow-md px-6 py-3">
          {/* Type Tabs */}
          <div className="flex gap-2 mb-0">
            {TYPES.map((t) => (
              <a
                key={t.key}
                href={`/stats/${t.key}/${season}`}
                className={`px-4 py-2 rounded-lg font-bold transition-colors text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-400/60 ${type === t.key ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                tabIndex={0}
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <StatsTableClient type={type} season={season} />
      </div>
    </main>
  );
}
