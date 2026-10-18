import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-under-nav relative min-h-screen bg-[#050508] text-white">
      <MeshGradientBackground />
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-4 pt-32 text-center">
        <PageHeader eyebrow="404" title="페이지를 찾을 수 없어요" />
        <Link
          href="/"
          className="flex min-h-11 items-center rounded-xl bg-red-500 px-5 text-sm font-medium transition-colors hover:bg-red-600"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
