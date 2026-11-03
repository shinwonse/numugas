'use client';

import { useCountAnimation } from '@/hooks/use-count-animation';

interface KeyStat {
  label: string;
  value: unknown;
}

/** 0.333 → ".333" (야구식 비율 표기) */
function baseballFormat(text: string) {
  return text.startsWith('0.') ? text.slice(1) : text;
}

function KeyStatCell({ label, value, index }: KeyStat & { index: number }) {
  const raw = value === null || value === undefined || value === '' ? '-' : String(value as string | number);
  const animated = useCountAnimation({ end: raw });

  return (
    <div
      className="bg-[#08080b]/80 px-4 py-5 md:px-6 md:py-6"
      style={{
        animation: `fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${String(index * 0.08)}s both`,
      }}
    >
      <dt className="text-[11px] font-semibold text-white/45">
        {label}
      </dt>
      <dd className="mt-2 text-3xl font-black leading-none tabular-nums tracking-tight text-white md:text-4xl">
        {baseballFormat(String(animated))}
      </dd>
    </div>
  );
}

/** 통산 핵심 지표 4개를 크게 보여주는 줄 (값이 0부터 올라간다) */
export function PlayerKeyStats({ stats }: { stats: KeyStat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
      {stats.map((stat, i) => (
        <KeyStatCell key={stat.label} label={stat.label} value={stat.value} index={i} />
      ))}
    </dl>
  );
}
