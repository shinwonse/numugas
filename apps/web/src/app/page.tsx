import { getSchedules } from '@numugas/util/crawlScheduleFromGameOne';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import Schedule from '#/app/components/Schedule';
import TopBatter from '#/app/components/TopBatter';
import TopPitcher from '#/app/components/TopPitcher';
import { cn } from '#/utils/cn';

export default function Home() {
  getSchedules();
  return (
    <main className={cn('flex flex-col gap-6 px-2')}>
      <Schedule />
      <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      <div className={cn('flex flex-col gap-2')}>
        <Link
          className={cn('flex flex-row items-center w-fit')}
          href="/stat/batter"
        >
          <h2>타자 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </Link>
        <TopBatter />
      </div>
      <div className={cn('flex flex-col gap-2')}>
        <Link
          className={cn('flex flex-row items-center w-fit')}
          href="/stat/pitcher"
        >
          <h2>투수 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </Link>
        <TopPitcher />
      </div>
    </main>
  );
}
