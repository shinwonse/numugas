import Image from 'next/image';

import { cn } from '#/utils/cn';

type Props = {
  emblem?: string;
  name?: string;
};

function TeamCard({ emblem = '', name = '' }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center')}>
      <Image
        alt={name}
        className={cn('rounded-full')}
        height={100}
        src={emblem}
        width={100}
      />
      <span>{name}</span>
    </div>
  );
}

export default TeamCard;
