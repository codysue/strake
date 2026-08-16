import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, useToast, type DataTableColumn } from '@codysue/strake';

interface Row {
  id: string;
  name: string;
  role: string;
  commits: number;
  status: 'active' | 'away' | 'offline';
}

const data: Row[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Design Engineer', commits: 128, status: 'active' },
  { id: '2', name: 'Grace Hopper', role: 'Staff Engineer', commits: 342, status: 'away' },
  { id: '3', name: 'Alan Kay', role: 'Design Systems', commits: 87, status: 'offline' },
  { id: '4', name: 'Radia Perlman', role: 'Infrastructure', commits: 214, status: 'active' },
];

const statusColor: Record<Row['status'], string> = {
  active: 'var(--strake-color-success)',
  away: 'var(--strake-color-warning)',
  offline: 'var(--strake-color-fg-subtle)',
};

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'commits', header: 'Commits', sortable: true, align: 'end' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: statusColor[row.status] }} />
        {row.status}
      </span>
    ),
  },
];

const meta: Meta = { title: 'Components/DataTable', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

/** Click a sortable header (aria-sort updates). With onRowActivate, rows are a roving-tabindex group — Tab in, ↑/↓ to move, Enter to activate. */
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const { toast } = useToast();
      return (
        <div className="sb-fill" style={{ maxWidth: 640 }}>
          <DataTable
            columns={columns}
            data={data}
            getRowId={(r) => r.id}
            caption="Contributors this cycle"
            defaultSort={{ key: 'commits', direction: 'desc' }}
            onRowActivate={(r) => toast({ title: r.name, description: `${r.commits} commits`, duration: 2000 })}
          />
        </div>
      );
    };
    return <Demo />;
  },
};
