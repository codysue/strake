import type { Meta, StoryObj } from '@storybook/react';
import { Button, useToast } from '@codysue/strake';

const meta: Meta = {
  title: 'Components/Toast',
};
export default meta;
type Story = StoryObj;

/** Toasts stack, auto-dismiss (hover to pause), and announce via an aria-live region. Danger/warning are assertive. */
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const { toast } = useToast();
      return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            onClick={() => toast({ title: 'Changes saved', description: 'Your workspace is up to date.', variant: 'success' })}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast({ title: 'New comment', description: 'Ada mentioned you in “Roadmap”.' })}
          >
            Default
          </Button>
          <Button
            variant="danger"
            onClick={() => toast({ title: 'Upload failed', description: 'The file was larger than 10 MB.', variant: 'danger' })}
          >
            Danger
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              toast({
                title: 'Project archived',
                description: 'You can restore it from settings.',
                action: { label: 'Undo', onClick: () => {} },
                duration: 8000,
              })
            }
          >
            With action
          </Button>
        </div>
      );
    };
    return <Demo />;
  },
};
