import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['components/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: true,
  esbuildOptions(options) {
    options.jsx = 'automatic';
  }
});
