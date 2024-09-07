'use client';

import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { NUMUGAS_SEASONS } from '#/constants';
import { cn } from '#/utils/cn';

type Props = {
  className?: string;
  initialSeason?: string;
  position: string;
};

function SeasonSelector({ className, initialSeason = 'all-time', position }: Props) {
  const router = useRouter();
  const [currentSeason, setCurrentSeason] = useState(initialSeason);

  const handleSeasonChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(e.target.value);
    router.push(`/stat/${position}?season=${e.target.value}`);
  };

  return (
    <label
      className={cn(
        'flex w-full flex-row items-center justify-center gap-3 whitespace-nowrap',
        className,
      )}
      htmlFor="season-select"
    >
      <div>
        <span className={cn('text-nowrap')}>시즌</span>
      </div>
      <select
        className={cn('flex w-full rounded bg-neutral-600 p-1')}
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
