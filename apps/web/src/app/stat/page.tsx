import { Suspense } from 'react';

import SeasonSelector from '#/app/stat/components/SeasonSelector';
import StatTable from '#/app/stat/components/StatTable';
import { cn } from '#/utils/cn';

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

function StatPage({ searchParams }: Props) {
  const { season } = searchParams;

  return (
    <main>
      <SeasonSelector className={cn('px-2')} initialSeason={season as string} />
      <Suspense fallback={<div>loading...</div>}>
        <StatTable className={cn('mt-4')} season={season as string} />
      </Suspense>
    </main>
  );
}

export default StatPage;
