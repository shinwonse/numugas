'use client';

import { SectionTitle } from '@/components/animated/section-title';
import { useCountAnimation } from '@/hooks/use-count-animation';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/cn';
import { TEAM_STATS_HREF } from '@/lib/opponents';
import type { TeamCareerStats } from '@/types/stats';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface StatsSectionProps {
  teamTotalStats: {
    win_rate: string;
    win: number;
    lose: number;
    draw: number;
  };
  teamCareerStats: TeamCareerStats;
  longestWinStreak: number;
  /** 경기 점수 합계 */
  runsFor: number;
}

interface StatCellProps {
  name: string;
  value: number | string;
  isInView: boolean;
}

/** 비율 기록은 카운트 중에도 ".287"처럼 야구식으로 0을 뗀다 */
function formatCount(animated: number | string, original: number | string) {
  const text = String(animated);
  return typeof original === 'string' && text.startsWith('0.')
    ? text.slice(1)
    : text;
}

function StatCell({ name, value, isInView }: StatCellProps) {
  const animatedValue = useCountAnimation({ end: value, isInView });

  return (
    <div className="group relative bg-black px-4 py-6 transition-colors duration-300 hover:bg-red-950/40 md:px-6 md:py-8">
      <dt className="text-[11px] font-semibold text-white/45 transition-colors group-hover:text-red-300">
        {name}
      </dt>
      <dd className="mt-3 text-3xl font-black tabular-nums tracking-tight text-white md:text-4xl">
        {formatCount(animatedValue, value)}
      </dd>
    </div>
  );
}

/** 승·무·패 비율 막대: 화면에 들어오면 각 구간이 차례로 차오른다 */
function RecordBar({
  win,
  draw,
  lose,
  isInView,
}: {
  win: number;
  draw: number;
  lose: number;
  isInView: boolean;
}) {
  const total = win + draw + lose || 1;
  const segments = [
    { key: 'win', value: win, className: 'bg-red-500' },
    { key: 'draw', value: draw, className: 'bg-white/40' },
    { key: 'lose', value: lose, className: 'bg-white/10' },
  ];

  return (
    <div
      className="flex h-2 w-full gap-0.5 overflow-hidden"
      role="img"
      aria-label={`${String(win)}승 ${String(draw)}무 ${String(lose)}패`}
    >
      {segments.map((segment, i) => (
        <span
          key={segment.key}
          className={cn('h-full origin-left', segment.className)}
          style={{
            width: `${String((segment.value / total) * 100)}%`,
            transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${String(0.3 + i * 0.25)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function StatsSection({
  teamTotalStats,
  teamCareerStats,
  longestWinStreak,
  runsFor,
}: StatsSectionProps) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.15 });
  const winRate = useCountAnimation({
    end: teamTotalStats.win_rate,
    isInView,
  });

  const records = [
    { name: '승', value: teamTotalStats.win, accent: true },
    { name: '무', value: teamTotalStats.draw, accent: false },
    { name: '패', value: teamTotalStats.lose, accent: false },
  ];

  const teamStats = [
    { name: '팀 타율', value: teamCareerStats.avg },
    { name: '팀 OPS', value: teamCareerStats.ops },
    { name: '안타', value: teamCareerStats.hits },
    { name: '홈런', value: teamCareerStats.homeruns },
    { name: '득점', value: runsFor },
    { name: '탈삼진', value: teamCareerStats.strikeouts },
    { name: '도루', value: teamCareerStats.stolenbases },
    { name: '최다 연승', value: longestWinStreak },
  ];

  return (
    <section
      id="통계"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative scroll-mt-8 py-20 md:py-28"
    >
      <div className="page-container relative z-10">
        <SectionTitle
          title="팀 통산 기록"
          isInView={isInView}
          action={
            <Link
              href={TEAM_STATS_HREF}
              className="inline-flex items-center gap-1 rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
            >
              시즌별 성적·상대 전적
              <ChevronRight aria-hidden className="h-4 w-4" />
            </Link>
          }
        />

        {/* 전광판: 승률 + 승무패 */}
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-red-950/50 via-black to-black p-6 md:p-10">
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold text-red-400">
                승률
              </p>
              <p className="mt-2 text-7xl font-black leading-none tabular-nums tracking-tight text-white md:text-8xl lg:text-9xl">
                {formatCount(winRate, teamTotalStats.win_rate)}
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4">
              {records.map((record) => (
                <div key={record.name}>
                  <dt className="text-xs font-semibold text-white/45">
                    {record.name}
                  </dt>
                  <dd
                    className={cn(
                      'mt-1 text-4xl font-black tabular-nums tracking-tight md:text-5xl',
                      record.accent ? 'text-red-500' : 'text-white',
                    )}
                  >
                    {record.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mt-8">
            <RecordBar
              win={teamTotalStats.win}
              draw={teamTotalStats.draw}
              lose={teamTotalStats.lose}
              isInView={isInView}
            />
          </div>
        </div>

        {/* 세부 기록: 1px 간격 격자로 표처럼 촘촘하게 */}
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-4">
          {teamStats.map((stat) => (
            <StatCell
              key={stat.name}
              name={stat.name}
              value={stat.value}
              isInView={isInView}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
