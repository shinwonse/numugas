import sharedConfig from '@numugas/tailwind-config/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.tsx'],
  prefix: 'ui-',
  presets: [sharedConfig],
};

export default config;
