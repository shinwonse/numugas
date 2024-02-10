import PitcherStatTableBody from '#/app/stat/components/PitcherStatTableBody';
import PitcherStatTableHead from '#/app/stat/components/PitcherStatTableHead';
import { fetchAllTimePitcherStats } from '#/libs/fetchAllTimePitcherStats';
import { cn } from '#/utils/cn';

type Props = {
  className?: string;
};

async function PitcherAllTimeStatTable({ className }: Props) {
  const allTimeStats = await fetchAllTimePitcherStats();

  return (
    <table
      className={cn(
        'table table-zebra text-nowrap whitespace-nowrap table-pin-rows',
        className
      )}
    >
      <PitcherStatTableHead />
      <PitcherStatTableBody stats={allTimeStats} />
    </table>
  );
}

export default PitcherAllTimeStatTable;
