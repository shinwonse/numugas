import { Header } from '@/components/header';
import { QueryClientProviderWrapper } from '@/components/query-client-provider-wrapper';
import { ThemeProvider } from '@/components/theme-provider';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { Montserrat, Orbitron } from 'next/font/google';
import type { Metadata } from 'next/types';
import type React from 'react';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: '담장NUMUGAS',
  description: '나는 내가 생각한 것보다 훨씬 강하다',
  openGraph: {
    title: '담장NUMUGAS',
    description: '나는 내가 생각한 것보다 훨씬 강하다',
    images: [
      {
        url: '/opengraph.png',
        width: 1200,
        height: 630,
        alt: '담장NUMUGAS 썸네일',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
    siteName: '담장NUMUGAS',
  },
};

const stagewiseConfig = {
  plugins: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${orbitron.variable} font-sans`}>
        <QueryClientProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="pt-20">{children}</div>
          </ThemeProvider>
        </QueryClientProviderWrapper>
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
      </body>
    </html>
  );
}
