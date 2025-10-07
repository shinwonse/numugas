'use client';

import type React from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';

/**
 * Next.js 공식 View Transitions API를 사용하는 레이아웃 래퍼
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition
 */
export function ViewTransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransition>{children}</ViewTransition>;
}
