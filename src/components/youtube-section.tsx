'use client';

import { SectionTitle } from '@/components/animated/section-title';
import { Card } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import type { YouTubeVideo } from '@/lib/fetchers/youtube';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/**
 * 썸네일을 먼저 보여주고, 재생을 누를 때 YouTube 플레이어를 불러온다.
 * (플레이어 iframe은 수백 KB의 스크립트를 받아서 처음부터 넣지 않는다)
 */
function YoutubeVideoContent({ video }: { video: YouTubeVideo }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Card className="bg-black/20 border-white/5 hover:border-red-500/30 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
            }}
            aria-label={`${video.title} 재생`}
            className="group absolute inset-0 cursor-pointer"
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover transition-opacity group-hover:opacity-80"
            />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            </span>
          </button>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{video.title}</h3>
        <p className="text-sm text-zinc-400">
          {new Date(video.publishedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </Card>
  );
}

export function YoutubeSection({ video }: { video: YouTubeVideo }) {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(80px)',
        transition: 'opacity 1s ease-out, transform 1s ease-out',
      }}
    >
      <div className="page-container relative z-10">
        <SectionTitle
          subtitle="GAME HIGHLIGHTS"
          title="경기 하이라이트"
          isInView={isInView}
        />
        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(50px)',
            transition: 'opacity 0.8s, transform 0.8s',
          }}
        >
          <YoutubeVideoContent video={video} />
        </div>
      </div>
    </section>
  );
}
