import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  clean: true,
  dts: false,
  // Bundles the generated token JSON in; leaves deps (sdk, zod) external.
  banner: { js: '#!/usr/bin/env node' },
});
