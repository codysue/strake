import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  async viteFinal(cfg) {
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      // Point the package name at source for live HMR against the library.
      '@codysue/strake': resolve(__dirname, '../packages/react/src/index.ts'),
    };
    // For GitHub Pages the site is served from /strake/. The deploy workflow
    // sets STORYBOOK_BASE=/strake/; local dev keeps '/'.
    cfg.base = process.env.STORYBOOK_BASE || '/';
    return cfg;
  },
};

export default config;
