import { crawlStatFromGameOne } from '@numugas/util';

import PitcherStatTableBody from '#/app/stat/components/PitcherStatTableBody';
import PitcherStatTableHead from '#/app/stat/components/PitcherStatTableHead';
import { cn } from '#/utils/cn';

const { getPitcherStats } = crawlStatFromGameOne;

type Props = {
  className?: string;
  season: string;
};

async function PitcherSeasonStatTable({ className, season }: Props) {
  const seasonStats = await getPitcherStats(season);

  if (seasonStats.length === 0) {
    return (
      <div className={cn('flex min-h-52 flex-col items-center justify-center')}>
        시즌 기록이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <table className={cn('table table-zebra whitespace-nowrap text-nowrap', className)}>
      <PitcherStatTableHead />
      <PitcherStatTableBody stats={seasonStats} />
    </table>
  );
}

export default PitcherSeasonStatTable;
