import BatterStatTableBody from '#/app/stat/components/BatterStatTableBody';
import { fetchAllTimeBatterStats } from '#/libs/fetchAllTimeBatterStats';
import { cn } from '#/utils/cn';

import BatterStatTableHead from '../BatterStatTableHead';

type Props = {
  className?: string;
};

async function BatterAllTimeStatTable({ className }: Props) {
  const allTimeStats = await fetchAllTimeBatterStats();

  return (
    <table
      className={cn('table table-zebra table-pin-rows whitespace-nowrap text-nowrap', className)}
    >
      <BatterStatTableHead />
      <BatterStatTableBody stats={allTimeStats} />
    </table>
  );
}

export default BatterAllTimeStatTable;
