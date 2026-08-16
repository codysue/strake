import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@codysue/strake';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Email', placeholder: 'you@example.com' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: {
    label: 'Workspace URL',
    description: 'Lowercase letters, numbers, and dashes.',
    placeholder: 'my-team',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    error: 'Enter a valid email address.',
  },
};

export const Required: Story = {
  args: { label: 'Full name', required: true, placeholder: 'Ada Lovelace' },
};

export const WithAdornments: Story = {
  args: {
    label: 'Amount',
    startAdornment: <span>$</span>,
    endAdornment: <span style={{ fontSize: 13 }}>USD</span>,
    placeholder: '0.00',
    inputMode: 'decimal',
  },
};

export const Disabled: Story = {
  args: { label: 'Email', value: 'locked@example.com', disabled: true },
};
