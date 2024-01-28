import BatterStatTableBody from '#/app/stat/components/BatterStatTableBody';
import { getAllTimeStats } from '#/libs/getAllTimeStats';
import { cn } from '#/utils/cn';

import BatterStatTableHead from '../BatterStatTableHead';

type Props = {
  className?: string;
};

async function AllTimeStatTable({ className }: Props) {
  const allTimeStats = await getAllTimeStats();

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
