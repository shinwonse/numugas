'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { NUMUGAS_SEASONS } from '#/constants';
import { cn } from '#/utils/cn';

type Props = {
  className?: string;
  initialSeason?: string;
};

function SeasonSelector({ className, initialSeason = 'all-time' }: Props) {
  const router = useRouter();
  const [currentSeason, setCurrentSeason] = useState(initialSeason);

  const handleSeasonChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(e.target.value);
    router.push(`/stat?season=${e.target.value}`);
  };

  return (
    <label
      className={cn(
        'flex flex-row items-center w-full gap-3 whitespace-nowrap justify-center',
        className
      )}
      htmlFor="season-select"
    >
      <div>
        <span className={cn('text-nowrap')}>시즌</span>
      </div>
      <select
        className={cn('flex w-full bg-neutral-600 rounded py-1 px-1')}
        onChange={handleSeasonChange}
        value={currentSeason}
      >
        <option value="all-time">통산</option>
        {NUMUGAS_SEASONS.map((season: string) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SeasonSelector;
