import { getSchedules } from '@numugas/util/crawlScheduleFromGameOne';
import Image from 'next/image';

import TeamCard from '#/app/components/TeamCard';
import { cn } from '#/utils/cn';

async function Schedule() {
  const schedules = await getSchedules();
  const recentGame = schedules[schedules.length / 2];

  return (
    <div
      className={cn(
        'w-full h-[300px] rounded-xl bg-base-content px-10 py-6 text-primary font-bold justify-center flex flex-col items-center gap-4'
      )}
    >
      <h2 className={cn('text-center')}>NEXT GAME</h2>
      <div className={cn('w-full flex flex-row justify-between items-center')}>
        <TeamCard
          emblem={recentGame?.homeTeam?.emblem}
          name={recentGame?.homeTeam?.name}
        />
        <span>VS</span>
        <TeamCard
          emblem={recentGame?.awayTeam?.emblem}
          name={recentGame?.awayTeam?.name}
        />
      </div>
      <div className={cn('flex flex-col gap-2 text-center')}>
        <span>{recentGame?.date}</span>
        <div className={cn('flex flex-row gap-1 text-center')}>
          <span>{recentGame?.leagueName}</span>
          <span>{recentGame?.stadium}</span>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
