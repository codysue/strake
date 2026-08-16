import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  CommandMenu,
  Dialog,
  Select,
  Switch,
  useToast,
  type CommandItem,
  type SelectOption,
} from '@codysue/strake';

const meta: Meta = {
  title: 'Patterns/Motion & Interaction',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const density: SelectOption[] = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Cozy', value: 'cozy' },
  { label: 'Compact', value: 'compact' },
];

function Showcase() {
  const { toast } = useToast();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const items: CommandItem[] = [
    { id: 'save', label: 'Save and publish', group: 'Actions', hint: '⌘S', onSelect: () => toast({ title: 'Published', variant: 'success', duration: 2200 }) },
    { id: 'invite', label: 'Invite teammate', group: 'Actions', onSelect: () => toast({ title: 'Invite sent', duration: 2200 }) },
    { id: 'delete', label: 'Delete project', group: 'Danger', onSelect: () => setDialogOpen(true) },
    { id: 'docs', label: 'Open documentation', group: 'Help', onSelect: () => toast({ title: 'Opening docs…', duration: 1800 }) },
  ];

  const card: React.CSSProperties = {
    background: 'var(--strake-color-surface)',
    border: '1px solid var(--strake-color-border)',
    borderRadius: 'var(--strake-radius-surface)',
    padding: 24,
    boxShadow: 'var(--strake-shadow-md)',
  };

  return (
    <div
      className="sb-fill"
      style={{
        minHeight: '100vh',
        background: 'var(--strake-color-bg)',
        color: 'var(--strake-color-fg)',
        fontFamily: 'var(--strake-font-family-sans)',
        padding: 48,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ width: 'min(720px, 100%)', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em' }}>Motion &amp; interaction</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--strake-color-fg-muted)' }}>
            Every transition here reads from the motion tokens. Try{' '}
            <kbd style={{ fontFamily: 'var(--strake-font-family-mono)' }}>⌘K</kbd>. Flip the toolbar
            theme — nothing below changes except the tokens.
          </p>
        </div>

        <div style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button onClick={() => setCmdOpen(true)}>Open command&nbsp;<kbd style={{ fontFamily: 'var(--strake-font-family-mono)', fontSize: 12 }}>⌘K</kbd></Button>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button variant="ghost" onClick={() => toast({ title: 'Saved', description: 'Draft saved just now.', variant: 'success' })}>
            Fire a toast
          </Button>
          <Button variant="danger" onClick={() => toast({ title: 'Something broke', description: 'A background job failed.', variant: 'danger' })}>
            Fire an error
          </Button>
        </div>

        <div style={{ ...card, display: 'grid', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span>Enable notifications</span>
            <Switch defaultChecked aria-label="Enable notifications" />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span>Reduced motion override</span>
            <Switch aria-label="Reduced motion override" />
          </label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span>Density</span>
            <div style={{ width: 200 }}>
              <Select options={density} defaultValue="cozy" aria-label="Density" />
            </div>
          </div>
        </div>
      </div>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} items={items} />
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Delete this project?"
        description="This permanently removes the project and everything in it."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setDialogOpen(false); toast({ title: 'Project deleted', variant: 'danger', duration: 2500 }); }}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Focus is trapped while this is open. Press Escape, or Tab around — you can&rsquo;t leave the panel.</p>
      </Dialog>
    </div>
  );
}

export const Showroom: Story = {
  render: () => <Showcase />,
};
