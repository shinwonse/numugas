import { fetchOpponentRecords } from '@/lib/fetchers/opponents';
import { fetchTeamCareerStats } from '@/lib/fetchers/team-career-stats';
import { fetchTeamSeasonRecords } from '@/lib/fetchers/team-stats';
import { formatWinLoss, formatWinRate } from '@/lib/opponents';
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

export default async function TeamStatsPage() {
  // 실패는 throw → error.tsx. 빈 결과가 ISR 캐시에 남지 않는다.
  const [seasons, career, opponents] = await Promise.all([
    fetchTeamSeasonRecords(),
    fetchTeamCareerStats(),
    fetchOpponentRecords(),
  ]);

  const total = seasons.reduce(
    (acc, r) => ({ win: acc.win + r.win, lose: acc.lose + r.lose, draw: acc.draw + r.draw }),
    { win: 0, lose: 0, draw: 0 },
  );
  const winRate = formatWinRate(total);

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
        <dl className={`${CARD} grid grid-cols-4 gap-3 p-4 text-center md:p-5`}>
          <Stat label="안타" value={career.hits.toLocaleString()} />
          <Stat label="홈런" value={career.homeruns.toLocaleString()} />
          <Stat label="루타" value={career.totalbases.toLocaleString()} />
          <Stat label="탈삼진" value={career.strikeouts.toLocaleString()} />
        </dl>
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
