import SeasonSelector from '#/app/stat/components/season-selector';
import StatTable from '#/app/stat/components/stat-table';

function StatPage() {
  return (
    <main>
      <SeasonSelector />
      <StatTable />
    </main>
  );
}

export default StatPage;
