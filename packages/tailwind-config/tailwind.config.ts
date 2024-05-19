import type { Config } from 'tailwindcss';
import tailwindScrollbar from 'tailwind-scrollbar';
import daisyui from 'daisyui';

const config: Omit<Config, "content"> = {
  darkMode: 'class',
  plugins: [tailwindScrollbar, daisyui],
  theme: {
    extend: {
      colors: {
        gray: getColorScale('gray'),
        accent: getColorScale('accent'),
        background: getColorScale('background'),
      }
    }
  },
};

export default config;

function getColorScale(name: string) {
  let scale: Record<any, any> = {};
  for (let i = 1; i <= 12; i++) {
    scale[i] = `var(--${name}-${i})`;
    scale[`a${i}`] = `var(--${name}-a${i})`;
  }
  return scale;
}
