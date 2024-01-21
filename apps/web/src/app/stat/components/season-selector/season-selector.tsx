'use client';

import { useState } from 'react';

import { cn } from '#/utils/cn';

function SeasonSelector() {
  const [season, setSeason] = useState(null);

  return (
    <label
      className={cn('flex flex-row w-full gap-3 whitespace-nowrap')}
      htmlFor="season-select"
    >
      <div>
        <span className={cn('text-nowrap')}>시즌</span>
      </div>
      <select className={cn('flex w-full bg-neutral-600 rounded')}>
        <option>통산</option>
        <option>2024</option>
        <option>2023</option>
        <option>2022</option>
        <option>2021</option>
        <option>2020</option>
      </select>
    </label>
  );
}

export default SeasonSelector;
