import localFont from 'next/font/local';

/**
 * 어그로체 (라인업 이미지 전용). 라인업 레이아웃에서만 쓴다.
 * 하단 네비가 /lineup을 미리 불러올 때 폰트까지 받지 않도록 preload를 끄고,
 * 라인업 미리보기가 실제로 그려질 때 받는다.
 */
export const aggravo = localFont({
  src: '../../public/fonts/sb-aggro-bold.woff2',
  weight: '700',
  style: 'normal',
  variable: '--font-aggravo',
  display: 'swap',
  preload: false,
});
