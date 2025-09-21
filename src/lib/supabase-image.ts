/**
 * Supabase Storage 이미지 변환 유틸리티
 * Image transformations를 통해 blur, 리사이징 등을 처리합니다.
 */

export function getBlurImageUrl(
  originalUrl: string,
  blur: number = 15,
): string {
  if (!originalUrl) return '/logo.png';

  // Supabase Storage URL인지 확인
  if (!originalUrl.includes('supabase')) return originalUrl;

  try {
    // blur 변환 파라미터 추가
    const url = new URL(originalUrl);
    url.searchParams.set('blur', blur.toString());
    url.searchParams.set('width', '40');
    url.searchParams.set('height', '40');
    url.searchParams.set('quality', '20');

    return url.toString();
  } catch (error) {
    console.error('Error creating blur URL:', error);
    return originalUrl;
  }
}

export function getPreviewImageUrl(
  originalUrl: string,
  size: number = 200,
): string {
  if (!originalUrl) return '/logo.png';

  if (!originalUrl.includes('supabase')) return originalUrl;

  try {
    const url = new URL(originalUrl);
    url.searchParams.set('width', size.toString());
    url.searchParams.set('height', size.toString());
    url.searchParams.set('quality', '75');
    url.searchParams.set('resize', 'cover'); // 비율 유지하며 크기 맞춤

    return url.toString();
  } catch (error) {
    console.error('Error creating preview URL:', error);
    return originalUrl;
  }
}

export function getOptimizedImageUrl(
  originalUrl: string,
  width?: number,
  height?: number,
): string {
  if (!originalUrl) return '/logo.png';

  if (!originalUrl.includes('supabase')) return originalUrl;

  try {
    const url = new URL(originalUrl);

    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());

    url.searchParams.set('quality', '85');
    url.searchParams.set('resize', 'cover');

    return url.toString();
  } catch (error) {
    console.error('Error creating optimized URL:', error);
    return originalUrl;
  }
}

export const ImageUtils = {
  // 매우 작은 blur 이미지 (플레이스홀더용)
  getTinyBlur: (url: string) => getBlurImageUrl(url, 20),

  // 중간 크기 preview (빠른 로딩)
  getPreview: (url: string) => getPreviewImageUrl(url, 150),

  // 고품질 이미지 (카드용)
  getCardSize: (url: string) => getOptimizedImageUrl(url, 400, 400),

  // 원본 고품질 이미지
  getFullSize: (url: string) => getOptimizedImageUrl(url),
};
