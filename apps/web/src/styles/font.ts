import { Karla } from 'next/font/google';

export const karla = Karla({
  display: 'block',
  fallback: ['sans-serif'],
  subsets: ['latin'],
  variable: '--font-karla',
  weight: ['400', '700'],
});
