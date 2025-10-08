'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useYouTubeLatest } from '@/hooks/use-youtube-latest';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function YoutubeVideoContent() {
  const { data: video } = useYouTubeLatest();

  if (!video) {
    return null;
  }

  return (
    <Card className="bg-black/20 border-white/5 hover:border-red-500/30 transition-all duration-300 overflow-hidden">
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

function YoutubeLoadingFallback() {
  return (
    <section className="py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display text-white tracking-tight">
            경기 영상
          </h2>
        </div>
        <Card className="bg-black/20 border-white/5 overflow-hidden">
          <Skeleton className="w-full aspect-video bg-zinc-800" />
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-800" />
            <Skeleton className="h-4 w-1/2 bg-zinc-800" />
          </div>
        </Card>
      </div>
    </section>
  );
}

function YoutubeErrorFallback() {
  return (
    <section className="py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display text-white tracking-tight">
            경기 영상
          </h2>
        </div>
        <Card className="bg-black/20 border-white/5 overflow-hidden">
          <div className="aspect-video flex items-center justify-center bg-zinc-900/50">
            <div className="text-center p-6">
              <p className="text-zinc-400 mb-2">영상을 불러올 수 없습니다</p>
              <p className="text-xs text-zinc-600">
                YouTube API 설정을 확인해주세요
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function YoutubeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="py-32 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display text-white tracking-tight"
          >
            경기 영상
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <YoutubeVideoContent />
        </motion.div>
      </div>
    </motion.section>
  );
}

export { YoutubeErrorFallback, YoutubeLoadingFallback };
