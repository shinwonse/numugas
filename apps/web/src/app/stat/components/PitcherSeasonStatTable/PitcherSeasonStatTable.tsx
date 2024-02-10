import { getPitcherStats } from '@numugas/util/crawler';

import PitcherStatTableBody from '#/app/stat/components/PitcherStatTableBody';
import PitcherStatTableHead from '#/app/stat/components/PitcherStatTableHead';
import { cn } from '#/utils/cn';

type Props = {
  className?: string;
  season: string;
};

async function PitcherSeasonStatTable({ className, season }: Props) {
  const seasonStats = await getPitcherStats(season);
  console.log(seasonStats);

  if (seasonStats.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-52')}>
        시즌 기록이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <table
      className={cn(
        'table table-zebra text-nowrap whitespace-nowrap',
        className
      )}
    >
      <PitcherStatTableHead />
      <PitcherStatTableBody stats={seasonStats} />
    </table>
  );
}

export default PitcherSeasonStatTable;
