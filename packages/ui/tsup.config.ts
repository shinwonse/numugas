import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/components/index.ts'],
  format: ['cjs', 'esm'],
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
