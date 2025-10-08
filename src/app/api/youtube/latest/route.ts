import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCrk3rn'; // @NUMUGAS-rk3rn의 채널 ID

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key is not configured' },
      { status: 500 },
    );
  }

  try {
    // YouTube Data API v3를 사용하여 채널의 최신 영상 가져오기
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`,
      {
        next: { revalidate: 3600 }, // 1시간 캐싱
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 });
    }

    const video = data.items[0];

    return NextResponse.json({
      id: video.id.videoId,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.high.url,
    });
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest video' },
      { status: 500 },
    );
  }
}
