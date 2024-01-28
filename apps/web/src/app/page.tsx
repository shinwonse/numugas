import { cn } from '#/utils/cn';

export default function Home() {
  return (
    <main className={cn('flex flex-col gap-6')}>
      <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
      <div className={cn('w-full h-[300px] bg-accent rounded-xl')} />
    </main>
  );
}
