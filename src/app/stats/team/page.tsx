import { fetchOpponentRecords } from '@/lib/fetchers/opponents';
import { fetchTeamCareerStats } from '@/lib/fetchers/team-career-stats';
import {
  fetchTeamGameRecords,
  type TeamGameHighlight,
} from '@/lib/fetchers/team-game-records';
import { fetchTeamSeasonRecords } from '@/lib/fetchers/team-stats';
import { toKstDateKey } from '@/lib/calendar-utils';
import { formatWinLoss, formatWinRate } from '@/lib/opponents';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next/types';
import { Suspense, type ReactNode } from 'react';
import { OpponentList, OpponentListFromParams } from './opponent-list';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '팀 기록',
  description:
    '담장NUMUGAS의 통산·시즌별 팀 성적과 상대팀별 승패, 득실점, 맞대결 기록을 확인하세요.',
};

const CARD = 'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl';
const LABEL = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 text-sm font-semibold text-white/70">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string | null }) {
  return (
    <div>
      <dt className={LABEL}>{label}</dt>
      <dd className="mt-1 text-lg font-bold tabular-nums text-white md:text-2xl">{value}</dd>
      {sub && <dd className="text-xs tabular-nums text-white/50">{sub}</dd>}
    </div>
  );
}

const SUB_TITLE = 'px-4 pt-4 text-xs font-semibold text-white/50 md:px-5';

/** 한 줄에 4개씩 놓는 기록 묶음 */
function StatGroup({
  title,
  stats,
}: {
  title: string;
  stats: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className={CARD}>
      <h3 className={SUB_TITLE}>{title}</h3>
      <dl
        className={`grid ${stats.length < 4 ? 'grid-cols-2' : 'grid-cols-4'} gap-x-3 gap-y-4 p-4 text-center md:p-5`}
      >
        {stats.map((stat) => (
          <Stat key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </dl>
    </div>
  );
}

/** 최다 점수차 승리 같은 기록 경기 한 줄 (경기 상세로 이동) */
function HighlightRow({ label, game }: { label: string; game: TeamGameHighlight }) {
  return (
    <li>
      <Link
        href={`/calendar/event/${game.id}`}
        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/[0.04] md:px-5"
      >
        <span className="w-28 shrink-0 text-white/50">{label}</span>
        <span className="min-w-0 flex-1 truncate text-white/80">
          <span className="tabular-nums text-white/40">
            {toKstDateKey(game.startsAt).replaceAll('-', '.')}
          </span>{' '}
          vs {game.opponent}
        </span>
        <span className="shrink-0 font-semibold tabular-nums text-white">
          {game.ours}:{game.theirs}
        </span>
        <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-white/30" />
      </Link>
    </li>
  );
}

const perGame = (runs: number, games: number) => (games ? (runs / games).toFixed(1) : '-');

export default async function TeamStatsPage() {
  // 실패는 throw → error.tsx. 빈 결과가 ISR 캐시에 남지 않는다.
  const [seasons, career, games, opponents] = await Promise.all([
    fetchTeamSeasonRecords(),
    fetchTeamCareerStats(),
    fetchTeamGameRecords(),
    fetchOpponentRecords(),
  ]);

  const total = seasons.reduce(
    (acc, r) => ({ win: acc.win + r.win, lose: acc.lose + r.lose, draw: acc.draw + r.draw }),
    { win: 0, lose: 0, draw: 0 },
  );
  const winRate = formatWinRate(total);

  const battingStats = [
    { label: '타율', value: career.avg },
    { label: '출루율', value: career.obp },
    { label: '장타율', value: career.slg },
    { label: 'OPS', value: career.ops },
    { label: '안타', value: career.hits.toLocaleString() },
    { label: '2루타', value: career.doubles.toLocaleString() },
    { label: '3루타', value: career.triples.toLocaleString() },
    { label: '홈런', value: career.homeruns.toLocaleString() },
    { label: '타점', value: career.rbi.toLocaleString() },
    { label: '루타', value: career.totalbases.toLocaleString() },
    { label: '도루', value: career.stolenbases.toLocaleString() },
    { label: '볼넷', value: career.walks.toLocaleString() },
  ];
  const pitchingStats = [
    { label: '승리', value: career.wins.toLocaleString() },
    { label: '세이브', value: career.saves.toLocaleString() },
    { label: '이닝', value: career.innings },
    { label: '탈삼진', value: career.strikeouts.toLocaleString() },
  ];

  // 최다 점수차 승리와 최다 득점이 같은 경기면 한 줄로 합친다
  const { biggestWin, mostRuns } = games;
  const highlights =
    biggestWin && mostRuns && biggestWin.id === mostRuns.id
      ? [{ label: '최다 득점·점수차', game: biggestWin }]
      : [
          ...(biggestWin ? [{ label: '최다 점수차 승리', game: biggestWin }] : []),
          ...(mostRuns ? [{ label: '한 경기 최다 득점', game: mostRuns }] : []),
        ];

  return (
    <div className="w-full space-y-8">
      <Section title="통산 기록">
        <dl className={`${CARD} grid grid-cols-3 gap-3 p-4 text-center md:p-5`}>
          <Stat label="경기" value={total.win + total.lose + total.draw} />
          <Stat
            label="전적"
            value={formatWinLoss(total)}
            sub={winRate && `승률 ${winRate}`}
          />
          <Stat label="상대 팀" value={opponents.length} />
        </dl>
        {games.games > 0 && (
          <div className={CARD}>
            <h3 className={SUB_TITLE}>경기</h3>
            <dl className="grid grid-cols-4 gap-x-3 gap-y-4 p-4 text-center md:p-5">
              <Stat
                label="득점"
                value={games.runsFor.toLocaleString()}
                sub={`경기당 ${perGame(games.runsFor, games.games)}`}
              />
              <Stat
                label="실점"
                value={games.runsAgainst.toLocaleString()}
                sub={`경기당 ${perGame(games.runsAgainst, games.games)}`}
              />
              <Stat
                label="득실차"
                value={`${games.runsFor >= games.runsAgainst ? '+' : ''}${String(games.runsFor - games.runsAgainst)}`}
              />
              <Stat label="최다 연승" value={games.longestWinStreak} />
            </dl>
            {highlights.length > 0 && (
              <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {highlights.map((h) => (
                  <HighlightRow key={h.game.id} label={h.label} game={h.game} />
                ))}
              </ul>
            )}
        <StatGroup title="타격" stats={battingStats} />
        <StatGroup title="투구" stats={pitchingStats} />
          </div>
        )}
      </Section>

      {seasons.length > 0 && (
        <Section title="시즌별 성적">
          <div className={`${CARD} overflow-hidden`}>
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40">
                  <th scope="col" className="px-4 py-3 text-left font-medium md:px-5">
                    시즌
                  </th>
                  <th scope="col" className="px-2 py-3 text-right font-medium">경기</th>
                  <th scope="col" className="px-2 py-3 text-right font-medium">승</th>
                  <th scope="col" className="px-2 py-3 text-right font-medium">패</th>
                  <th scope="col" className="px-2 py-3 text-right font-medium">무</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium md:px-5">
                    승률
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {seasons.map((r) => (
                  <tr key={r.season} className="text-white/80">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-white md:px-5">
                      {r.season}
                    </th>
                    <td className="px-2 py-3 text-right">{r.win + r.lose + r.draw}</td>
                    <td className="px-2 py-3 text-right">{r.win}</td>
                    <td className="px-2 py-3 text-right">{r.lose}</td>
                    <td className="px-2 py-3 text-right">{r.draw}</td>
                    <td className="px-4 py-3 text-right md:px-5">{formatWinRate(r) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section title="상대 전적">
        {/* ?team= 은 클라이언트에서 읽어 페이지는 정적으로 캐시한다 */}
        <Suspense fallback={<OpponentList records={opponents} />}>
          <OpponentListFromParams records={opponents} />
        </Suspense>
      </Section>
    </div>
  );
}
