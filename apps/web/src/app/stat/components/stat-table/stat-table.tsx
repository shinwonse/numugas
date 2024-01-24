import AllTimeStatTable from '#/app/stat/components/all-time-stat-table';
import SeasonStatTable from '#/app/stat/components/season-stat-table/season-stat-table';
import { cn } from '#/utils/cn';

type StatTableProps = {
  className?: string;
  season?: string;
};

async function StatTable({ className, season = 'all-time' }: StatTableProps) {
  return (
    <div className={cn('overflow-x-scroll', className)}>
      {season === 'all-time' && <AllTimeStatTable />}
      {season !== 'all-time' && <SeasonStatTable season={season} />}
    </div>
  );
}

export default StatTable;
