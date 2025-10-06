import localFont from 'next/font/local';

export const aggravo = localFont({
  src: [
    {
      path: '../../public/fonts/SB 어그로OTF L.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SB 어그로OTF M.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SB 어그로OTF B.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-aggravo',
  display: 'swap',
});
