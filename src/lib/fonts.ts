import localFont from 'next/font/local';

export const aggravo = localFont({
  src: [
    {
      path: '../../public/fonts/sb-aggro-light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sb-aggro-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sb-aggro-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-aggravo',
  display: 'swap',
});
