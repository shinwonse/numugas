'use client';

import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import { PageHeader } from '@/components/page-header';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

/** 페이지를 그리다 실패했을 때 (DB 조회 실패 등) */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-under-nav relative min-h-screen bg-[#050508] text-white">
      <MeshGradientBackground />
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-4 pt-32 text-center">
        <PageHeader eyebrow="Error" title="불러오지 못했어요" />
        <p className="-mt-4 mb-8 text-sm text-white/60">
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-red-500 px-5 text-sm font-medium transition-colors hover:bg-red-600"
          >
            <RotateCcw className="h-4 w-4" />
            다시 시도
          </button>
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
