import { Header } from '@/components/header';
import { QueryClientProviderWrapper } from '@/components/query-client-provider-wrapper';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ViewTransitionLayout } from '@/components/view-transition-layout';
import { aggravo } from '@/lib/fonts';
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
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
      : 'http://localhost:3000',
  ),
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
      <body
        className={`${montserrat.variable} ${orbitron.variable} ${aggravo.variable} font-sans antialiased`}
      >
        <QueryClientProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />
            <ViewTransitionLayout>
              <div className="pt-16">{children}</div>
            </ViewTransitionLayout>
            <Toaster />
          </ThemeProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
