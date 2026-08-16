import * as React from 'react';
import type { Preview } from '@storybook/react';
import { ToastProvider } from '@codysue/strake';
import '../packages/react/src/styles/strake.css';
import './preview.css';

type Theme = 'light' | 'dark';

function Frame({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return (
    <ToastProvider>
      <div className="sb-frame" data-theme={theme}>
        {children}
      </div>
    </ToastProvider>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
    layout: 'centered',
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', 'Patterns'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <Frame theme={(context.globals.theme as Theme) ?? 'light'}>
        <Story />
      </Frame>
    ),
  ],
};

export default preview;
