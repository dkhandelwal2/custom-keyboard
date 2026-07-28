import { defineConfig } from 'tsup';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

export default defineConfig({
  entry: ['components/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: true,
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.plugins = options.plugins || [];
    options.plugins.unshift(cssModulesPlugin({ inject: false, localsConvention: 'camelCaseOnly' }));
  }
});
