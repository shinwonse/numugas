import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { cn } from '#/utils/cn';

const AllTimeStatTable = dynamic(() => import('../BatterAllTimeStatTable'));
const SeasonStatTable = dynamic(
  () =>
    import('#/app/stat/components/BatterSeasonStatTable/BatterSeasonStatTable')
);

const StatTableView = {
  AllTIME: AllTimeStatTable,
  SEASON: SeasonStatTable,
};

type StatTableProps = {
  className?: string;
  season?: string;
};

async function BatterStatTable({
  className,
  season = 'all-time',
}: StatTableProps) {
  const CurrentStatTable =
    StatTableView[season === 'all-time' ? 'AllTIME' : 'SEASON'];

  return (
    <div className={cn('overflow-x-auto', className)}>
      <Suspense fallback={<div>loading</div>}>
        <CurrentStatTable season={season as string} />
      </Suspense>
    </div>
  );
}

export default BatterStatTable;
