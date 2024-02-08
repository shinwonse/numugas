import SeasonSelector from '#/app/stat/components/SeasonSelector';
import { cn } from '#/utils/cn';

import BatterStatTable from '../components/BatterStatTable';

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

function BatterStatPage({ searchParams }: Props) {
  const { season } = searchParams;

  return (
    <main>
      <SeasonSelector className={cn('px-2')} initialSeason={season as string} />
      <BatterStatTable className={cn('mt-4')} season={season as string} />
    </main>
  );
}

export default BatterStatPage;
