import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Ship these as peers/deps rather than bundling them into the library.
  external: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion', '@floating-ui/react'],
});
