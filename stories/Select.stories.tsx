import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select, type SelectOption } from '@codysue/strake';

const options: SelectOption[] = [
  { label: 'Verdigris', value: 'verdigris' },
  { label: 'Slate', value: 'slate' },
  { label: 'Amber', value: 'amber' },
  { label: 'Vermilion (out of stock)', value: 'vermilion', disabled: true },
  { label: 'Ultramarine', value: 'ultramarine' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { options, 'aria-label': 'Accent color', placeholder: 'Choose a color…' },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Select>;

/** Open it and try the keyboard: ↑/↓ to move, type "am" to jump to Amber, Enter to pick, Esc to close. */
export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | null>('slate');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <span style={{ fontFamily: 'var(--strake-font-family-mono)', fontSize: 13, color: 'var(--strake-color-fg-muted)' }}>
          value: {value ?? 'null'}
        </span>
      </div>
    );
  },
};

export const Preselected: Story = {
  args: { defaultValue: 'amber' },
};
