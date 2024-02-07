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

function RankerCard({
  className,
  playerName,
  playerNumber,
  title,
  value,
}: Props) {
  return (
    <div
      className={cn(
        'relative flex flex-col bg-base-content rounded aspect-square p-3 overflow-hidden',
        className
      )}
    >
      <div className={cn('absolute w-[90%] h-[90%] -bottom-10 -right-10')}>
        <Image alt="background" className={cn('opacity-50')} fill src={Logo} />
      </div>
      <p className={cn('flex flex-col')}>
        <span className={cn('text-xl')}>{title}</span>
        <span className={cn('text-2xl text-red-700')}>{value}</span>
      </p>
      <p className={cn('flex flex-col text-xl mt-8')}>
        <span>{playerNumber}</span>
        <span>{playerName}</span>
      </p>
    </div>
  );
}

export default RankerCard;
