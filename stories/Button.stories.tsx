import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@codysue/strake';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button
        leftIcon={
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
        }
      >
        New item
      </Button>
      <Button variant="secondary" rightIcon={<span>→</span>}>
        Continue
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
