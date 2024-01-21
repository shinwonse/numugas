import Link from 'next/link';

import { cn } from '#/utils/cn';

export default function Home() {
  return (
    <main className={cn('flex flex-col')}>
      <Link href="/stat">기록</Link>
    </main>
  );
}
