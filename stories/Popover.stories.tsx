import type { Meta, StoryObj } from '@storybook/react';
import { Popover, Button, TextField } from '@codysue/strake';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
};
export default meta;
type Story = StoryObj<typeof Popover>;

/** Click to open; focus moves into the panel; Escape or an outside click closes it and returns focus. */
export const Default: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">Edit dimensions</Button>}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: 'var(--strake-color-fg)',
            fontFamily: 'var(--strake-font-family-sans)',
          }}
        >
          Dimensions
        </p>
        <TextField label="Width" defaultValue="640" size="sm" />
        <TextField label="Height" defaultValue="480" size="sm" />
        <Button size="sm">Apply</Button>
      </div>
    </Popover>
  ),
};
