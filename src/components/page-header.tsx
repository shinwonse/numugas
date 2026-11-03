import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

/**
 * 페이지 공통 제목: 붉은 막대 + 영문 eyebrow, 아래에서 밀려 올라오는 큰 한글 제목.
 * CSS 애니메이션만 써서 서버 컴포넌트에서도 그대로 쓸 수 있다.
 */
export function PageHeader({
  eyebrow,
  title,
  className,
}: {
  /** 제목 위 작은 안내 (인원수·대상 등 실제 정보가 있을 때만) */
  eyebrow?: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-8', className)}>
      {eyebrow && (
        <p className="mb-3 flex items-center gap-3 text-sm font-semibold text-red-400 [.text-center_&]:justify-center">
          <span
            aria-hidden
            className="h-px w-8 origin-left bg-red-500"
            style={{ animation: 'scale-in-x 0.8s cubic-bezier(0.65, 0, 0.35, 1) both' }}
          />
          {eyebrow}
        </p>
      )}
      <h1 className="overflow-hidden pb-1">
        <span
          className="block text-4xl font-black tracking-tight text-white md:text-5xl"
          style={{ animation: 'rise-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
        >
          {title}
        </span>
      </h1>
    </header>
  );
}
