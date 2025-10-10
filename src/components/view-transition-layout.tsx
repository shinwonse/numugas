'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

/**
 * Next.js View Transitions를 위한 레이아웃 래퍼
 * 브라우저가 View Transitions API를 지원하고, 에러가 발생하지 않을 때만 사용
 */
export function ViewTransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // View Transitions API 에러 핸들링
    const handleViewTransitionError = (event: Event) => {
      // View transition 에러를 조용히 처리
      console.debug('View transition skipped:', event);
    };

    // 전역 에러 리스너 추가 (선택적)
    window.addEventListener('unhandledrejection', handleViewTransitionError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleViewTransitionError,
      );
    };
  }, []);

  // 서버 렌더링과 클라이언트 렌더링 동기화
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
