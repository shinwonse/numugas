import getStats from '@numugas/util/crawler';

import { getAllTimeStats } from '#/libs/getAllTimeStats';

async function StatTable() {
  const stats = await getAllTimeStats();
  console.log(stats);
  // const stats = await Promise.resolve(getStats('2023'));
  return <div>stat</div>;
}

export default StatTable;
