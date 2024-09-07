import Image from 'next/image';

import { cn } from '#/utils/cn';

import Logo from '../../../../public/logo.png';

type Props = {
  className?: string;
  playerName: string;
  playerNumber: number;
  title: string;
  value: string | number;
};

function RankerCard({ className, playerName, playerNumber, title, value }: Props) {
  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col overflow-hidden rounded bg-base-content p-3',
        className,
      )}
    >
      <div className={cn('absolute -bottom-10 -right-10 size-[90%]')}>
        <Image alt="background" className={cn('opacity-50')} fill src={Logo} />
      </div>
      <p className={cn('flex flex-col')}>
        <span className={cn('text-xl')}>{title}</span>
        <span className={cn('text-2xl text-red-700')}>{value}</span>
      </p>
      <p className={cn('mt-8 flex flex-col text-xl')}>
        <span>{playerNumber}</span>
        <span>{playerName}</span>
      </p>
    </div>
  );
}

export default RankerCard;
