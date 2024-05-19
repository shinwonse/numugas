import commonTailwindConfig from '@numugas/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [commonTailwindConfig],
};

export default config;
