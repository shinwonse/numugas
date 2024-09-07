import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import Schedule from '#/app/components/Schedule';
import TopBatter from '#/app/components/TopBatter';
import TopPitcher from '#/app/components/TopPitcher';
import { cn } from '#/utils/cn';

export default function Home() {
  return (
    <main className={cn('flex flex-col gap-6 px-2')}>
      <Schedule />
      <div className={cn('flex flex-col gap-2')}>
        <Link className={cn('flex w-fit flex-row items-center')} href="/stat/batter">
          <h2>타자 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </Link>
        <TopBatter />
      </div>
      <div className={cn('flex flex-col gap-2')}>
        <Link className={cn('flex w-fit flex-row items-center')} href="/stat/pitcher">
          <h2>투수 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </Link>
        <TopPitcher />
      </div>
    </main>
  );
}
