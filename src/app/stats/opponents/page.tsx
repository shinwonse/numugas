import { fetchOpponentRecords } from '@/lib/fetchers/opponents';
import { formatWinLoss } from '@/lib/opponents';
import type { Metadata } from 'next/types';
import { Suspense } from 'react';
import { OpponentList, OpponentListFromParams } from './opponent-list';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '상대 전적',
  description: '담장NUMUGAS의 상대팀별 승패와 득실점, 맞대결 기록을 확인하세요.',
};

export default async function OpponentsPage() {
  // 실패는 throw → error.tsx. 빈 결과가 ISR 캐시에 남지 않는다.
  const records = await fetchOpponentRecords();

  const total = records.reduce(
    (acc, r) => ({
      games: acc.games + r.games,
      win: acc.win + r.win,
      lose: acc.lose + r.lose,
      draw: acc.draw + r.draw,
    }),
    { games: 0, win: 0, lose: 0, draw: 0 },
  );
  const decided = total.win + total.lose;

  return (
    <div className="w-full space-y-4">
      <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-center backdrop-blur-xl md:p-5">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            경기
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-white">{total.games}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            전적
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-white md:text-2xl">
            {formatWinLoss(total)}
          </dd>
          {decided > 0 && (
            <dd className="text-xs tabular-nums text-white/50">
              승률 {(total.win / decided).toFixed(3)}
            </dd>
          )}
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            상대 팀
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-white">{records.length}</dd>
        </div>
      </dl>

      {/* ?team= 은 클라이언트에서 읽어 페이지는 정적으로 캐시한다 */}
      <Suspense fallback={<OpponentList records={records} />}>
        <OpponentListFromParams records={records} />
      </Suspense>
    </div>
  );
}
