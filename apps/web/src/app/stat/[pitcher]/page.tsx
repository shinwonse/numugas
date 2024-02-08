import SeasonSelector from '#/app/stat/components/SeasonSelector';
import { cn } from '#/utils/cn';

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

function PitcherStatPage({ searchParams }: Props) {
  const { season } = searchParams;

  return (
    <main>
      <SeasonSelector className={cn('px-2')} initialSeason={season as string} />
    </main>
  );
}

export default PitcherStatPage;
