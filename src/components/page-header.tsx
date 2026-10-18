import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

/** 페이지 공통 제목: 영문 eyebrow + 한글 제목 (구단 캘린더 스타일 기준) */
export function PageHeader({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-8 text-center', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">{title}</h1>
    </header>
  );
}
