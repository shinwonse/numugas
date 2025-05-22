import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StatsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-10 bg-background px-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary font-display drop-shadow-sm">
          기록 보기
        </h1>
      </div>
      <div className="flex gap-6 mt-6">
        <Link href="/stats/batter" passHref legacyBehavior>
          <Button
            asChild
            size="lg"
            className="text-lg font-bold shadow-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 transition-colors duration-200"
          >
            <a>타자 기록</a>
          </Button>
        </Link>
        <Link href="/stats/pitcher" passHref legacyBehavior>
          <Button
            asChild
            size="lg"
            className="text-lg font-bold shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 transition-colors duration-200"
          >
            <a>투수 기록</a>
          </Button>
        </Link>
      </div>
    </main>
  );
}
