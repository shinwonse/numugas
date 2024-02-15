import Image from 'next/image';

import { cn } from '#/utils/cn';

type Props = {
  emblem?: string;
  name?: string;
};

function TeamCard({ emblem = '', name = '' }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2')}>
      <Image
        alt={name}
        className={cn('rounded-full aspect-square')}
        height={100}
        src={emblem}
        width={100}
      />
      <span>{name}</span>
    </div>
  );
}

export default TeamCard;
