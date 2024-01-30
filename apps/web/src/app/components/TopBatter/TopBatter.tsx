import { cn } from '#/utils/cn';

function TopBatter() {
  return (
    <div
      className={cn(
        'grid md:grid-cols-3 gap-4 text-primary font-bold grid-cols-2'
      )}
    >
      <div
        className={cn(
          'flex flex-col bg-base-content rounded aspect-square p-3'
        )}
      >
        <p className={cn('flex flex-col')}>
          <h3 className={cn('text-xl')}>타율</h3>
          <span className={cn('text-2xl text-red-700')}>0.456</span>
        </p>
        <p className={cn('flex flex-col text-xl mt-8')}>
          <span>51</span>
          <span>홍창기</span>
        </p>
      </div>
      <div
        className={cn(
          'flex flex-col bg-base-content rounded aspect-square p-3'
        )}
      >
        <p className={cn('flex flex-col')}>
          <h3 className={cn('text-xl')}>홈런</h3>
          <span className={cn('text-2xl text-red-700')}>10</span>
        </p>
        <p className={cn('flex flex-col text-xl mt-8')}>
          <span>51</span>
          <span>홍창기</span>
        </p>
      </div>
      <div
        className={cn(
          'flex flex-col bg-base-content rounded aspect-square p-3'
        )}
      >
        <p className={cn('flex flex-col')}>
          <h3 className={cn('text-xl')}>타점</h3>
          <span className={cn('text-2xl text-red-700')}>123</span>
        </p>
        <p className={cn('flex flex-col text-xl mt-8')}>
          <span>51</span>
          <span>홍창기</span>
        </p>
      </div>
    </div>
  );
}

export default TopBatter;
