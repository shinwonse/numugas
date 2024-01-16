import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { karla } from '@/styles/font';
import { cn } from '@/utils/cn';

export const metadata: Metadata = {
  description: '담장 NUMUGAS 기록 사이트',
  title: '담장 NUMUGAS',
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body className={cn(karla.variable, 'overscroll-none')}>{children}</body>
    </html>
  );
}
