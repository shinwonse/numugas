import type { Config } from 'tailwindcss';
import tailwindScrollbar from 'tailwind-scrollbar';
import daisyui from 'daisyui';

const config: Omit<Config, "content"> = {
  darkMode: 'class',
  plugins: [tailwindScrollbar, daisyui],
};

export default config;
