import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandMenu, Button, useToast, type CommandItem } from '@codysue/strake';

const meta: Meta<typeof CommandMenu> = {
  title: 'Components/Command Menu',
  component: CommandMenu,
};
export default meta;
type Story = StoryObj<typeof CommandMenu>;

/** Press ⌘K (or Ctrl+K) anywhere, or click the button. Arrow keys move, type to filter, Enter selects. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();

    const pick = (label: string) => () =>
      toast({ title: `Ran “${label}”`, variant: 'default', duration: 2500 });

    const items: CommandItem[] = [
      { id: 'new', label: 'New project', group: 'Actions', hint: '⌘N', keywords: ['create'], onSelect: pick('New project') },
      { id: 'invite', label: 'Invite teammate', group: 'Actions', keywords: ['member', 'add'], onSelect: pick('Invite teammate') },
      { id: 'search', label: 'Search files', group: 'Actions', hint: '⌘P', onSelect: pick('Search files') },
      { id: 'theme', label: 'Toggle theme', group: 'Preferences', keywords: ['dark', 'light'], onSelect: pick('Toggle theme') },
      { id: 'shortcuts', label: 'Keyboard shortcuts', group: 'Preferences', hint: '?', onSelect: pick('Keyboard shortcuts') },
      { id: 'billing', label: 'Billing settings', group: 'Preferences', onSelect: pick('Billing settings') },
      { id: 'docs', label: 'Documentation', group: 'Help', onSelect: pick('Documentation') },
      { id: 'archived', label: 'Archived (unavailable)', group: 'Help', disabled: true, onSelect: () => {} },
    ];

    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open command menu&nbsp;&nbsp;<kbd style={{ fontFamily: 'var(--strake-font-family-mono)', fontSize: 12 }}>⌘K</kbd>
        </Button>
        <CommandMenu open={open} onOpenChange={setOpen} items={items} />
      </>
    );
  },
};
