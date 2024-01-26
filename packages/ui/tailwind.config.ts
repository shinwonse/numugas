import sharedConfig from '@numugas/tailwind-config';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

const config: Pick<
  Config,
  'prefix' | 'presets' | 'content' | 'daisyui' | 'plugins'
> = {
  content: ['./src/**/*.tsx'],
  daisyui: {},
  plugins: [daisyui],
  prefix: 'ui-',
  presets: [sharedConfig],
};

export default config;
