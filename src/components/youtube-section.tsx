'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
}

export function YoutubeSection() {
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch('/api/youtube/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  if (isLoading) {
    return (
      <section className="relative w-full py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            최신 영상
          </h2>
          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
            <Skeleton className="w-full aspect-video bg-zinc-800" />
          </Card>
        </div>
      </section>
    );
  }

  if (error || !video) {
    return null;
  }

  return (
    <section className="relative w-full py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          최신 영상
        </h2>
        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {video.title}
            </h3>
            <p className="text-sm text-zinc-400">
              {new Date(video.publishedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
