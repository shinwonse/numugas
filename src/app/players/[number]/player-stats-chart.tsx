'use client';

import StatsTabs from '@/components/stats-tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatInning, parseInning } from '@/lib/inning';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type Row = { season: string } & Record<string, number | string>;

interface MetricGroup {
  key: string;
  label: string;
  config: ChartConfig;
  /** 축·툴팁 숫자 표시 */
  format: (value: number, dataKey: string) => string;
}

const COLORS = ['#ef4444', '#f97316', '#eab308'];

function metrics(entries: Array<[key: string, label: string]>): ChartConfig {
  return Object.fromEntries(
    entries.map(([key, label], i) => [key, { label, color: COLORS[i] }]),
  );
}

const toFixed = (digits: number) => (value: number) => value.toFixed(digits);
const toInteger = (value: number) => String(Math.round(value));

/**
 * 시즌별 지표 추이. 지표 묶음(비율/누적)을 토글로 바꿔 본다.
 * 시즌이 2개 미만이면 선이 그려지지 않으므로 숨긴다.
 */
function TrendChart({ data, groups }: { data: Row[]; groups: MetricGroup[] }) {
  const [groupKey, setGroupKey] = useState(groups[0].key);
  if (data.length < 2) return null;

  const group = groups.find((g) => g.key === groupKey) ?? groups[0];
  const keys = Object.keys(group.config);

  return (
    <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          시즌별 추이
        </h2>
        <StatsTabs
          tabs={groups.map((g) => ({ key: g.key, label: g.label }))}
          current={group.key}
          onTabClick={setGroupKey}
          className="mx-0 h-9 max-w-[10rem]"
        />
      </div>

      <ChartContainer config={group.config} className="h-[260px] w-full md:h-[300px]">
        <LineChart data={data} margin={{ top: 5, right: 12, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="season"
            stroke="rgba(255,255,255,0.45)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.45)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={44}
            domain={[0, 'auto']}
            allowDecimals={group.key === 'rate'}
            tickFormatter={(v: number) => group.format(v, '')}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name, entry) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {group.config[String(name)].label}
                    </span>
                    <span className="font-mono font-medium tabular-nums text-white">
                      {typeof value === 'number' ? group.format(value, String(name)) : value}
                    </span>
                  </div>
                )}
              />
            }
          />
          {keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: `var(--color-${key})` }}
              activeDot={{ r: 5.5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
        {keys.map((key) => (
          <li key={key} className="flex items-center gap-2 text-sm text-white/60">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: group.config[key].color }}
            />
            {group.config[key].label}
          </li>
        ))}
      </ul>
    </section>
  );
}

interface BatterSeasonStat {
  season: number;
  hits: number;
  homeruns: number;
  rbi: number;
  avg: string;
  onbasepercentage: string;
  sluggingpercentage: string;
}

const BATTER_GROUPS: MetricGroup[] = [
  {
    key: 'rate',
    label: '비율',
    config: metrics([
      ['avg', '타율'],
      ['obp', '출루율'],
      ['slg', '장타율'],
    ]),
    format: toFixed(3),
  },
  {
    key: 'count',
    label: '누적',
    config: metrics([
      ['hits', '안타'],
      ['homeruns', '홈런'],
      ['rbi', '타점'],
    ]),
    format: toInteger,
  },
];

export function BatterStatsChart({ seasonStats }: { seasonStats: BatterSeasonStat[] }) {
  const data = seasonStats.map((stat) => ({
    season: String(stat.season),
    avg: Number(stat.avg) || 0,
    obp: Number(stat.onbasepercentage) || 0,
    slg: Number(stat.sluggingpercentage) || 0,
    hits: stat.hits,
    homeruns: stat.homeruns,
    rbi: stat.rbi,
  }));

  return <TrendChart data={data} groups={BATTER_GROUPS} />;
}

interface PitcherSeasonStat {
  season: number;
  era: string;
  whip: string;
  innings: string;
  strikeouts: number;
  wins: number;
}

const PITCHER_GROUPS: MetricGroup[] = [
  {
    key: 'rate',
    label: '비율',
    config: metrics([
      ['era', 'ERA'],
      ['whip', 'WHIP'],
    ]),
    format: toFixed(2),
  },
  {
    key: 'count',
    label: '누적',
    config: metrics([
      ['innings', '이닝'],
      ['strikeouts', '탈삼진'],
      ['wins', '승'],
    ]),
    // 이닝은 1/3 단위라 툴팁에서 "12.1"처럼 야구식으로 보여준다
    format: (value, dataKey) =>
      dataKey === 'innings' ? formatInning(value) : toInteger(value),
  },
];

export function PitcherStatsChart({ seasonStats }: { seasonStats: PitcherSeasonStat[] }) {
  const data = seasonStats.map((stat) => ({
    season: String(stat.season),
    era: Number(stat.era) || 0,
    whip: Number(stat.whip) || 0,
    innings: parseInning(stat.innings),
    strikeouts: stat.strikeouts,
    wins: stat.wins,
  }));

  return <TrendChart data={data} groups={PITCHER_GROUPS} />;
}
