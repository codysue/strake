import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import metadata from '../tokens/dist/metadata/tokens.json';

interface TokenRecord {
  name: string;
  path: string[];
  group: string;
  type: string;
  value: string;
  description: string | null;
}

const tokens = (metadata as { tokens: TokenRecord[] }).tokens;
const byGroup = (g: string) => tokens.filter((t) => t.group === g);

const cell: React.CSSProperties = {
  fontFamily: 'var(--strake-font-family-mono)',
  fontSize: 12,
  color: 'var(--strake-color-fg-muted)',
};

function Swatches({ group }: { group: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
        width: '100%',
      }}
    >
      {byGroup(group).map((t) => (
        <div key={t.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              height: 44,
              borderRadius: 8,
              background: t.value,
              border: '1px solid var(--strake-color-border)',
            }}
          />
          <div style={{ ...cell, color: 'var(--strake-color-fg)' }}>
            {t.path.slice(1).join('.')}
          </div>
          <div style={cell}>{t.value}</div>
        </div>
      ))}
    </div>
  );
}

function ScaleTable({ groups }: { groups: string[] }) {
  const rows = tokens.filter((t) => groups.includes(t.group));
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
      <thead>
        <tr style={{ textAlign: 'left', color: 'var(--strake-color-fg-muted)' }}>
          <th style={{ padding: '6px 12px' }}>Token</th>
          <th style={{ padding: '6px 12px' }}>Value</th>
          <th style={{ padding: '6px 12px' }}>CSS variable</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr key={t.name} style={{ borderTop: '1px solid var(--strake-color-border)' }}>
            <td style={{ padding: '6px 12px' }}>{t.path.join('.')}</td>
            <td style={{ ...cell, padding: '6px 12px' }}>{t.value}</td>
            <td style={{ ...cell, padding: '6px 12px' }}>{t.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-fill" style={{ maxWidth: 860 }}>
      {children}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

/** Rendered live from `tokens/dist/metadata/tokens.json` — the same file the MCP server serves. */
export const Color: Story = {
  render: () => (
    <Panel>
      <p style={{ color: 'var(--strake-color-fg-muted)', marginBottom: 16 }}>
        {tokens.length} tokens, generated from one DTCG source. Semantic roles
        resolve to primitives and flip in dark mode; primitives are the raw ramps.
      </p>
      <h3 style={{ color: 'var(--strake-color-fg)' }}>Semantic — surfaces &amp; text</h3>
      <Swatches group="color" />
    </Panel>
  ),
};

export const Scales: Story = {
  render: () => (
    <Panel>
      <ScaleTable groups={['space', 'radius', 'fontSize', 'duration', 'easing']} />
    </Panel>
  ),
};
