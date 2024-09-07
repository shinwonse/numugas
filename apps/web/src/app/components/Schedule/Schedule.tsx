import { crawlScheduleFromGameOne } from '@numugas/util';

import TeamCard from '#/app/components/TeamCard';
import { cn } from '#/utils/cn';

const { getSchedules } = crawlScheduleFromGameOne;

async function Schedule() {
  const schedules = await getSchedules();
  const recentGame = schedules[schedules.length / 2];

  return (
    <div
      className={cn(
        'flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-base-content px-10 py-6 font-bold text-primary',
      )}
    >
      <h2 className={cn('text-center')}>NEXT GAME</h2>
      <div className={cn('flex w-full flex-row items-center justify-between')}>
        <TeamCard emblem={recentGame?.homeTeam?.emblem} name={recentGame?.homeTeam?.name} />
        <span>VS</span>
        <TeamCard emblem={recentGame?.awayTeam?.emblem} name={recentGame?.awayTeam?.name} />
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
