import PitcherStatTable from '#/app/stat/components/PitcherStatTable';
import SeasonSelector from '#/app/stat/components/SeasonSelector';
import { cn } from '#/utils/cn';

import BatterStatTable from '../components/BatterStatTable';

const StatTableView = {
  BATTER: BatterStatTable,
  PITCHER: PitcherStatTable,
};

type Props = {
  params: { position: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function StatPage({ params, searchParams }: Props) {
  const { season } = searchParams;
  const { position } = params;
  const StatTable = StatTableView[position === 'batter' ? 'BATTER' : 'PITCHER'];

  return (
    <main>
      <SeasonSelector
        className={cn('px-2')}
        initialSeason={season as string}
        position={position}
      />
      <StatTable className={cn('mt-4')} season={season as string} />
    </main>
  );
}

export default StatPage;
