export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCrk3rn'; // @NUMUGAS-rk3rn의 채널 ID

/**
 * 채널의 최신 영상 (1시간 캐시). 홈 화면 보조 섹션이라 실패하면 null을 돌려
 * 페이지 전체가 깨지지 않게 하고, 섹션만 숨긴다.
 */
export async function fetchLatestYouTubeVideo(): Promise<YouTubeVideo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) throw new Error(`YouTube API ${response.status}`);

    const data = (await response.json()) as {
      items?: {
        id: { videoId: string };
        snippet: { title: string; publishedAt: string };
      }[];
    };
    const video = data.items?.[0];
    if (!video) return null;

    return {
      id: video.id.videoId,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
    };
  } catch (error) {
    console.error('[youtube] 최신 영상 조회 실패', error);
    return null;
  }
}
