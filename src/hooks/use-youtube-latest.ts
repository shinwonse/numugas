import { useSuspenseQuery } from '@tanstack/react-query';

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
}

async function fetchLatestYouTubeVideo(): Promise<YouTubeVideo> {
  const response = await fetch('/api/youtube/latest');

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube video');
  }

  return response.json();
}

export function useYouTubeLatest() {
  return useSuspenseQuery({
    queryKey: ['youtube', 'latest'],
    queryFn: fetchLatestYouTubeVideo,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 2, // 2시간 (구 cacheTime)
  });
}
