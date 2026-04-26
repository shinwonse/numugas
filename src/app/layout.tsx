import { FloatingNav } from '@/components/floating-nav';
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
    process.env.NEXT_PUBLIC_SITE_URL || 'https://numugas.com',
  ),
  title: {
    default: '담장NUMUGAS',
    template: '%s | 담장NUMUGAS',
  },
  description: '나는 내가 생각한 것보다 훨씬 강하다',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '담장NUMUGAS',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  keywords: [
    '담장NUMUGAS',
    '담장너머가쓰',
    '야구',
    '통계',
    '선수',
    '타자',
    '투수',
    '사회인야구',
  ],
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
  twitter: {
    card: 'summary_large_image',
    title: '담장NUMUGAS',
    description: '나는 내가 생각한 것보다 훨씬 강하다',
    images: ['/opengraph.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: ['BmUnEK4eiebYi0QfFxss18eGv65UJw34-VVjK4m6z6g'],
    other: {
      'naver-site-verification': ['ab154e376d6703d2d1fbf18b3a59d9c902416bbf'],
    },
  },
};

const stagewiseConfig = {
  plugins: [],
};

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://numugas.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: '담장NUMUGAS',
      description: '담장NUMUGAS 사회인 야구팀 - 선수 정보, 타자/투수 기록, 라인업',
      inLanguage: 'ko',
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    {
      '@type': 'SportsTeam',
      '@id': `${baseUrl}/#organization`,
      name: '담장NUMUGAS',
      alternateName: '담장너머가쓰',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/opengraph.png`,
      },
      sport: '야구',
    },
    {
      '@type': 'SiteNavigationElement',
      name: '선수 명단',
      description: '담장NUMUGAS 야구팀 선수 명단 - 포지션별 선수 정보',
      url: `${baseUrl}/players`,
    },
    {
      '@type': 'SiteNavigationElement',
      name: '기록실',
      description: '담장NUMUGAS 타자/투수 시즌별 통계 기록',
      url: `${baseUrl}/stats`,
    },
    {
      '@type': 'SiteNavigationElement',
      name: '라인업',
      description: '담장NUMUGAS 경기 라인업 구성 및 추천',
      url: `${baseUrl}/lineup`,
    },
    {
      '@type': 'SiteNavigationElement',
      name: '팀 소개',
      description: '담장NUMUGAS 야구팀 연혁과 역사',
      url: `${baseUrl}/about`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splash/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1080x2340.png" media="(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1320x2868.png" media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
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
            <ViewTransitionLayout>
              <div className="pb-28">{children}</div>
              <FloatingNav />
            </ViewTransitionLayout>
            <Toaster />
          </ThemeProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
