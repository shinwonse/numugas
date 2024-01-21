import SeasonSelector from '#/app/stat/components/season-selector';
import StatTable from '#/app/stat/components/stat-table';

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

function StatPage({ searchParams }: Props) {
  const { season } = searchParams;
  return (
    <main>
      <SeasonSelector />
      <StatTable season={season as string} />
    </main>
  );
}

export default StatPage;
