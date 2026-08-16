import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, Button } from '@codysue/strake';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Opens on hover and on keyboard focus; dismisses on Escape. Tab to the button to see it. */
export const Default: Story = {
  render: () => (
    <Tooltip content="Copy link to clipboard">
      <Button variant="secondary">Hover or focus me</Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Placed ${side}`} side={side}>
          <Button variant="ghost">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
