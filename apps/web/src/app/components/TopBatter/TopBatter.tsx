'use client';

import RankerCard from '#/app/components/RankerCard';
import { fetchTopBatters } from '#/libs/fetchTopBatters';
import { cn } from '#/utils/cn';

async function TopBatter() {
  const { topHitBatter, topHrBatter, topRbiBatter } = await fetchTopBatters();
  return (
    <div
      className={cn(
        'grid md:grid-cols-3 gap-4 text-primary font-bold grid-cols-2'
      )}
    >
      <RankerCard
        playerName={topHitBatter?.name.split('(')[0]}
        playerNumber={topHitBatter?.name.split('(')[1].split(')')[0]}
        title="안타"
        value={topHitBatter?.hit}
      />
      <RankerCard
        playerName={topHrBatter?.name.split('(')[0]}
        playerNumber={topHrBatter?.name.split('(')[1].split(')')[0]}
        title="홈런"
        value={topHrBatter?.hr}
      />
      <RankerCard
        playerName={topRbiBatter?.name.split('(')[0]}
        playerNumber={topRbiBatter?.name.split('(')[1].split(')')[0]}
        title="타점"
        value={topRbiBatter?.rbi}
      />
    </div>
  );
}

export default TopBatter;
