import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@codysue/strake';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: { 'aria-label': 'Toggle setting' },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

export const WithLabel: Story = {
  render: () => {
    const id = 'notify';
    return (
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <Switch id={id} defaultChecked aria-label="Email notifications" />
        <span style={{ fontFamily: 'var(--strake-font-family-sans)', color: 'var(--strake-color-fg)' }}>
          Email notifications
        </span>
      </label>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Switch checked={on} onCheckedChange={setOn} aria-label="Controlled" />
        <span style={{ fontFamily: 'var(--strake-font-family-mono)', fontSize: 13, color: 'var(--strake-color-fg-muted)' }}>
          {on ? 'on' : 'off'}
        </span>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Switch size="sm" defaultChecked aria-label="Small" />
      <Switch size="md" defaultChecked aria-label="Medium" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
