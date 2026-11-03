'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/cn';
import type { Player, Stat } from '@/types/stats';

interface LeaderCardProps {
  stat: Stat;
  index: number;
}

/** 0.287 → ".287"처럼 야구식 표기로 맞춘다 */
function formatValue(value: number | string) {
  const text = String(value);
  return text.startsWith('0.') ? text.slice(1) : text;
}

/**
 * 부문별 순위 카드: 1위는 크게, 나머지는 1위 대비 막대와 함께 한 줄씩.
 * 화면에 들어오면 막대가 왼쪽부터 차오른다.
 */
function LeaderCard({ stat, index }: LeaderCardProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.3 });
  const [leader, ...rest] = stat.players as [Player | undefined, ...Player[]];
  const max = Math.max(...stat.players.map((p) => p.value), 0);
  const delay = (index % 4) * 0.08;

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]',
        'transition-colors duration-300 hover:border-red-500/40 hover:bg-white/[0.05]',
      )}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${String(delay)}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${String(delay)}s, border-color 0.3s, background-color 0.3s`,
      }}
    >
      {/* 좌측 붉은 기준선: 호버하면 위에서 아래로 그어진다 */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-red-500 transition-transform duration-500 group-hover:scale-y-100"
      />

      <header className="px-5 pt-5">
        <h3 className="text-xs font-semibold text-white/50">
          {stat.category}
        </h3>
      </header>

      {leader && (
        <div className="flex items-end justify-between gap-3 px-5 pb-4 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-red-400">
              1위
            </p>
            <p className="truncate text-xl font-bold text-white">
              {leader.name}
            </p>
          </div>
          <p className="text-4xl font-black leading-none tabular-nums tracking-tight text-white transition-colors duration-300 group-hover:text-red-400 md:text-5xl">
            {formatValue(leader.value)}
          </p>
        </div>
      )}

      <ol className="border-t border-white/[0.06]">
        {rest.map((player) => {
          const ratio = max > 0 ? player.value / max : 0;
          return (
            <li
              key={`${String(player.rank)}-${player.name}`}
              className="relative flex items-center gap-3 px-5 py-3 text-sm"
            >
              <span
                aria-hidden
                className="absolute inset-y-1 left-0 origin-left bg-red-500/[0.08]"
                style={{
                  width: `${String(ratio * 100)}%`,
                  transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
                  transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${String(delay + 0.3)}s`,
                }}
              />
              <span className="relative w-4 text-xs font-bold tabular-nums text-white/40">
                {player.rank}
              </span>
              <span className="relative flex-1 truncate font-medium text-white/80">
                {player.name}
              </span>
              <span className="relative font-bold tabular-nums text-white">
                {formatValue(player.value)}
              </span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

export function LeaderBoard({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <LeaderCard key={stat.category} stat={stat} index={index} />
      ))}
    </div>
  );
}
