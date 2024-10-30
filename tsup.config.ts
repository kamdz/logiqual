import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    cli: 'bin/cli.ts',
    index: 'src/index.ts'
  },
  format: ['cjs', 'esm'],
  minify: true,
  sourcemap: true,
  splitting: false
});
