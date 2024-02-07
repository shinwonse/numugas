import BatterStatTableBody from '#/app/stat/components/BatterStatTableBody';
import { fetchAllTimeStats } from '#/libs/fetchAllTimeStats';
import { cn } from '#/utils/cn';

import BatterStatTableHead from '../BatterStatTableHead';

type Props = {
  className?: string;
};

async function AllTimeStatTable({ className }: Props) {
  const allTimeStats = await fetchAllTimeStats();

  return (
    <table
      className={cn(
        'table table-zebra text-nowrap whitespace-nowrap table-pin-rows',
        className
      )}
    >
      <BatterStatTableHead />
      <BatterStatTableBody stats={allTimeStats} />
    </table>
  );
}

export default AllTimeStatTable;
