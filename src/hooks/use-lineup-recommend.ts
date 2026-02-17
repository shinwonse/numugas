import type { LineupRecommendResponse } from '@/types/lineup';
import { useMutation } from '@tanstack/react-query';

async function fetchLineupRecommendation(): Promise<LineupRecommendResponse> {
  const res = await fetch('/api/lineup-recommend', { method: 'POST' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'AI 라인업 추천에 실패했습니다.');
  }
  return res.json();
}

export function useLineupRecommend() {
  return useMutation({
    mutationFn: fetchLineupRecommendation,
  });
}
