import dynamic from 'next/dynamic';

import { cn } from '#/utils/cn';

const AllTimeStatTable = dynamic(
  () => import('#/app/stat/components/all-time-stat-table')
);
const SeasonStatTable = dynamic(
  () => import('#/app/stat/components/season-stat-table/season-stat-table')
);

type StatTableProps = {
  className?: string;
  season?: string;
};

const StatTableView = {
  AllTIME: AllTimeStatTable,
  SEASON: SeasonStatTable,
};

async function StatTable({ className, season = 'all-time' }: StatTableProps) {
  const CurrentStatTable =
    StatTableView[season === 'all-time' ? 'AllTIME' : 'SEASON'];

  return (
    <div className={cn('overflow-x-auto', className)}>
      <CurrentStatTable season={season as string} />
    </div>
  );
}

export default StatTable;
