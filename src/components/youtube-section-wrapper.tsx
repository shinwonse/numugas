'use client';

import dynamic from 'next/dynamic';
import { YoutubeLoadingFallback } from './youtube-section';

const YoutubeSection = dynamic(
  () =>
    import('./youtube-section').then((mod) => ({
      default: mod.YoutubeSection,
    })),
  {
    ssr: false,
    loading: () => <YoutubeLoadingFallback />,
  },
);

export function YoutubeSectionWrapper() {
  return <YoutubeSection />;
}
