import SeasonSelector from '#/app/stat/components/season-selector';
import StatTable from '#/app/stat/components/stat-table';
import { cn } from '#/utils/cn';

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

function StatPage({ searchParams }: Props) {
  const { season } = searchParams;

  return (
    <main className={cn('')}>
      <SeasonSelector />
      <StatTable className={cn('mt-4')} season={season as string} />
    </main>
  );
}

export default StatPage;
