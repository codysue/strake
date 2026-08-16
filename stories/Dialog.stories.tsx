import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, Button } from '@codysue/strake';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};
export default meta;
type Story = StoryObj<typeof Dialog>;

/** Focus is trapped (Tab wraps), Escape closes, background scroll is locked, and focus returns to the trigger. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete this project?"
          description="This permanently removes the project and everything in it."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete project
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Type the project name in a real app to confirm. Here, either button closes
            the dialog. Try tabbing — focus never leaves the panel.
          </p>
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const initialRef = React.useRef<HTMLInputElement>(null);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Rename</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Rename workspace"
          initialFocusRef={initialRef}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <label style={{ display: 'grid', gap: 6, fontFamily: 'var(--strake-font-family-sans)' }}>
            <span style={{ fontSize: 13, color: 'var(--strake-color-fg)' }}>Workspace name</span>
            <input
              ref={initialRef}
              defaultValue="Strake"
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid var(--strake-color-border-strong)',
                background: 'var(--strake-color-surface)',
                color: 'var(--strake-color-fg)',
              }}
            />
          </label>
        </Dialog>
      </>
    );
  },
};
