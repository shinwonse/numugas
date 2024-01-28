// Alert 사용을 위한 임시 use client

'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { cn } from '#/utils/cn';

export default function Home() {
  return (
    <main className={cn('flex flex-col gap-6')}>
      <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      <div className={cn('flex flex-col gap-2')}>
        <Link className={cn('flex flex-row items-center w-fit')} href="/stat">
          <h2>타자 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </Link>
        <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      </div>
      <div className={cn('flex flex-col gap-2')}>
        <button
          className={cn('flex flex-row items-center w-fit')}
          onClick={() => alert('준비중입니다.')}
          type="button"
        >
          <h2>투수 기록</h2>
          <ChevronRightIcon height={20} width={20} />
        </button>
        <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      </div>
    </main>
  );
}
