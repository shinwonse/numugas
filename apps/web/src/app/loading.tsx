import { BeatLoader } from 'react-spinners';

import { cn } from '#/utils/cn';

function Loading() {
  return (
    <div
      className={cn('flex min-h-screen flex-col items-center justify-center')}
    >
      <BeatLoader color="#000000" />
    </div>
  );
}

export default Loading;
