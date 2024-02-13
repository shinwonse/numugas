import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Footer from '#/app/components/Footer';
import Header from '#/app/components/Header';
import Provider from '#/app/components/Provider';
import { karla } from '#/styles/font';
import { cn } from '#/utils/cn';

export const metadata: Metadata = {
  description: '담장 NUMUGAS 홈페이지입니다.',
  metadataBase: new URL('https://numugas.vercel.app'),
  openGraph: {
    description: '담장 NUMUGAS 홈페이지입니다.',
    images: [
      {
        alt: '담장 NUMUGAS',
        height: 630,
        url: 'https://numugas.vercel.app/og-image.png',
        width: 1200,
      },
    ],
    title: '담장 NUMUGAS',
    type: 'website',
    url: 'https://numugas.vercel.app',
  },
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
        <div className={cn('pt-16')}>
          <Provider>{children}</Provider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
