import { notFound } from 'next/navigation';
import StatsTableClient from './stats-table-client';

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
  const type = decodeURIComponent(params.type);
  const season = decodeURIComponent(params.season);
  const typeObj = TYPES.find((t) => t.key === type);
  if (!typeObj || !SEASONS.includes(season)) notFound();

  return (
    <main className="flex flex-col gap-0 bg-black min-h-screen">
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-md mx-auto grid grid-cols-2 h-12 rounded-xl mb-8 bg-zinc-900 border border-zinc-800 shadow-lg"
          role="tablist"
          aria-orientation="horizontal"
          tabIndex={0}
          data-orientation="horizontal"
        >
          {TYPES.map((t) => {
            const isActive = t.key === type;
            return (
              <a
                key={t.key}
                href={`/stats/${encodeURIComponent(t.key)}/${encodeURIComponent(season)}`}
                className={
                  `flex items-center justify-center h-full w-full text-center font-bold text-lg transition-all duration-150 select-none ` +
                  (isActive
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-zinc-900 text-zinc-400 hover:text-red-400') +
                  ' rounded-xl'
                }
                style={{ fontFamily: 'inherit' }}
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                role="tab"
              >
                {t.label}
              </a>
            );
          })}
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <StatsTableClient type={type} season={season} />
      </div>
    </main>
  );
}
