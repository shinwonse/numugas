import daisyui from 'daisyui';
import tailwindScrollbar from 'tailwind-scrollbar';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes: ['business'],
  },
  plugins: [tailwindScrollbar, daisyui],
};
export default config;
