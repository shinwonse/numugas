import { cn } from '#/utils/cn';

export default function Home() {
  return (
    <main className={cn('flex flex-col')}>
      <div className={cn('w-full h-[300px] bg-accent')}>일정 컨테이너</div>
      <div>
        <h2>BATTER STATS</h2>
      </div>
      <div>
        <h2>PITCHER STATS</h2>
      </div>
    </main>
  );
}
