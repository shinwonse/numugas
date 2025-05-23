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
  description: '담장NUMUGAS 공식 홈페이지',
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
