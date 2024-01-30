import './globals.css';

import Footer from 'components/Footer';
import Header from 'components/Header';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { karla } from '#/styles/font';
import { cn } from '#/utils/cn';

export const metadata: Metadata = {
  description: '담장 NUMUGAS',
  title: '담장 NUMUGAS',
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body
        className={cn(
          karla.variable,
          'overscroll-none mx-auto max-w-3xl flex flex-col justify-center'
        )}
      >
        <Header />
        <div className={cn('pt-16')}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
