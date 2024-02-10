import { getBatterStats } from '@numugas/util/crawlStatFromGameOne';

import BatterStatTableBody from '#/app/stat/components/BatterStatTableBody';
import BatterStatTableHead from '#/app/stat/components/BatterStatTableHead';
import { cn } from '#/utils/cn';

type Props = {
  className?: string;
  season: string;
};

async function BatterSeasonStatTable({ className, season }: Props) {
  const seasonStats = await getBatterStats(season);

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
      <BatterStatTableHead />
      <BatterStatTableBody stats={seasonStats} />
    </table>
  );
}

export default BatterSeasonStatTable;
