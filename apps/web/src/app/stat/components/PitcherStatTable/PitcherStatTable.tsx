import dynamic from 'next/dynamic';

import { cn } from '#/utils/cn';

const AllTimeStatTable = dynamic(() => import('../PitcherAllTimeStatTable'));
const SeasonStatTable = dynamic(
  () =>
    import(
      '#/app/stat/components/PitcherSeasonStatTable/PitcherSeasonStatTable'
    )
);

const StatTableView = {
  AllTIME: AllTimeStatTable,
  SEASON: SeasonStatTable,
};

type StatTableProps = {
  className?: string;
  season?: string;
};

async function PitcherStatTable({
  className,
  season = 'all-time',
}: StatTableProps) {
  const CurrentStatTable =
    StatTableView[season === 'all-time' ? 'AllTIME' : 'SEASON'];

  return (
    <div className={cn('overflow-x-auto', className)}>
      <CurrentStatTable season={season} />
    </div>
  );
}

export default PitcherStatTable;
