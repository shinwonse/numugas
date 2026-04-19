'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BatterSeasonStat {
  season: number;
  atbats: number;
  hits: number;
  walks: number;
  hitbypitch: number;
  sacrificeflies: number;
  totalbases: number;
}

interface PitcherSeasonStat {
  season: number;
  era: string;
  whip: string;
  strikeouts: number;
  innings: string;
}

const batterChartConfig = {
  avg: { label: '타율', color: '#ef4444' },
  obp: { label: '출루율', color: '#f97316' },
  slg: { label: '장타율', color: '#eab308' },
} satisfies ChartConfig;

const pitcherChartConfig = {
  era: { label: 'ERA', color: '#ef4444' },
  whip: { label: 'WHIP', color: '#f97316' },
} satisfies ChartConfig;

export function BatterStatsChart({ seasonStats }: { seasonStats: BatterSeasonStat[] }) {
  if (seasonStats.length < 2) return null;

  const data = seasonStats.map((stat) => {
    const avg = stat.atbats ? stat.hits / stat.atbats : 0;
    const obpDenom = stat.atbats + stat.walks + stat.hitbypitch + stat.sacrificeflies;
    const obp = obpDenom ? (stat.hits + stat.walks + stat.hitbypitch) / obpDenom : 0;
    const slg = stat.atbats ? stat.totalbases / stat.atbats : 0;

    return {
      season: String(stat.season),
      avg: Number(avg.toFixed(3)),
      obp: Number(obp.toFixed(3)),
      slg: Number(slg.toFixed(3)),
    };
  });

  return (
    <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
        성적 추이
      </h2>
      <ChartContainer config={batterChartConfig} className="h-[300px] w-full">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="season"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            tickFormatter={(v: number) => v.toFixed(3)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => {
                  if (typeof value === 'number') return value.toFixed(3);
                  return value;
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="var(--color-avg)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-avg)' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="obp"
            stroke="var(--color-obp)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-obp)' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="slg"
            stroke="var(--color-slg)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-slg)' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
      <div className="flex justify-center gap-6 mt-4">
        {Object.entries(batterChartConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-sm text-gray-400">{config.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PitcherStatsChart({ seasonStats }: { seasonStats: PitcherSeasonStat[] }) {
  if (seasonStats.length < 2) return null;

  const data = seasonStats.map((stat) => ({
    season: String(stat.season),
    era: Number(parseFloat(stat.era || '0').toFixed(2)),
    whip: Number(parseFloat(stat.whip || '0').toFixed(2)),
  }));

  return (
    <section className="w-full bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl shadow-red-400/10 p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
        성적 추이
      </h2>
      <ChartContainer config={pitcherChartConfig} className="h-[300px] w-full">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="season"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="era"
            stroke="var(--color-era)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-era)' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="whip"
            stroke="var(--color-whip)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-whip)' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
      <div className="flex justify-center gap-6 mt-4">
        {Object.entries(pitcherChartConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-sm text-gray-400">{config.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
