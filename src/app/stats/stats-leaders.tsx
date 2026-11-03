'use client';

import type { StatsType } from './stats-columns';

type Row = Record<string, unknown>;

/** 1위를 보여주는 부문 (누적 기록만: 비율 기록은 규정 타석 없이 1위를 뽑으면 왜곡된다) */
const LEADER_CATEGORIES: Record<StatsType, Array<{ key: string; label: string }>> = {
  batter: [
    { key: 'hits', label: '안타' },
    { key: 'homeruns', label: '홈런' },
    { key: 'rbi', label: '타점' },
    { key: 'stolenbases', label: '도루' },
  ],
  pitcher: [
    { key: 'wins', label: '승리' },
    { key: 'strikeouts', label: '탈삼진' },
    { key: 'innings', label: '이닝' },
    { key: 'saves', label: '세이브' },
  ],
};

/** 값이 바뀌면(시즌·리그 전환) 아래에서 다시 밀려 올라온다 */
function LeaderValue({ value }: { value: string }) {
  return (
    <span className="block overflow-hidden">
      <span
        key={value}
        className="block text-4xl font-black leading-none tabular-nums tracking-tight text-white md:text-5xl"
        style={{ animation: 'rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {value}
      </span>
    </span>
  );
}

/** 기록 표 위의 부문별 1위 */
export function StatsLeaders({ type, rows }: { type: StatsType; rows: Row[] }) {
  const leaders = LEADER_CATEGORIES[type].flatMap((category) => {
    let best: Row | undefined;
    let bestValue = 0;
    for (const row of rows) {
      const value = Number(row[category.key]);
      if (Number.isFinite(value) && value > bestValue) {
        best = row;
        bestValue = value;
      }
    }
    return best ? [{ ...category, name: String(best.name), value: String(best[category.key]) }] : [];
  });

  if (leaders.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
      {leaders.map((leader) => (
        <div
          key={leader.key}
          className="group flex flex-col justify-between gap-3 bg-[#08080b] p-4 transition-colors hover:bg-[#120709] md:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-red-400">
              {leader.label}
            </span>
            <span className="text-[11px] font-semibold text-white/40">1위</span>
          </div>
          <LeaderValue value={leader.value} />
          <p className="truncate text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
            {leader.name}
          </p>
        </div>
      ))}
    </div>
  );
}
