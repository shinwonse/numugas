import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

const SEASONS = ['통산', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const TYPES = ['batter', 'pitcher'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://numugas.com';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lineup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 통계 페이지 (타자/투수 × 시즌)
  const statsPages: MetadataRoute.Sitemap = TYPES.flatMap((type) =>
    SEASONS.map((season) => ({
      url: `${baseUrl}/stats/${encodeURIComponent(type)}/${encodeURIComponent(season)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  );

  // 선수 상세 페이지
  let playerPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from('players')
      .select('number')
      .order('number', { ascending: true });

    if (data) {
      playerPages = data.map((player) => ({
        url: `${baseUrl}/players/${player.number}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // 실패 시 선수 페이지 없이 진행
  }

  return [...staticPages, ...statsPages, ...playerPages];
}
