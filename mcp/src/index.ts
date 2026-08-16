// @codysue/strake-mcp — a read-only MCP server exposing Strake's tokens and
// component metadata as agent-queryable tools. See SECURITY.md for the threat
// model. In one line: local stdio, static public data, no write/exec/network,
// inputs treated as opaque lookup keys.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import tokenData from './generated/tokens.json';
import { components } from './components';

interface TokenRecord {
  name: string;
  path: string[];
  group: string;
  type: string;
  value: string;
  description: string | null;
}

const tokens = (tokenData as { tokens: TokenRecord[] }).tokens;

// Exact-match indexes. Inputs are used only as keys into these maps or as
// Array.filter predicates — never interpolated into a shell, path, query, or eval.
const byCssVar = new Map(tokens.map((t) => [t.name, t] as const));
const byPath = new Map(tokens.map((t) => [t.path.join('.'), t] as const));
const groups = [...new Set(tokens.map((t) => t.group))].sort();

function findToken(raw: string): TokenRecord | null {
  const q = raw.trim();
  return byCssVar.get(q) ?? byPath.get(q) ?? byCssVar.get(`--${q.replace(/^--/, '')}`) ?? null;
}

const componentByName = new Map(components.map((c) => [c.name.toLowerCase(), c] as const));
function findComponent(raw: string) {
  const q = raw.trim().toLowerCase();
  return componentByName.get(q) ?? components.find((c) => c.name.toLowerCase().includes(q)) ?? null;
}

const asText = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

const server = new McpServer({ name: 'strake-mcp', version: '0.1.0' });

server.tool(
  'list_tokens',
  'List Strake design tokens (read-only). Optionally filter by `group` (e.g. "color", "space") or a `query` substring on the token name/path.',
  { group: z.string().optional(), query: z.string().optional() },
  async ({ group, query }) => {
    let result = tokens;
    if (group) result = result.filter((t) => t.group === group);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.path.join('.').toLowerCase().includes(q),
      );
    }
    return asText({
      count: result.length,
      availableGroups: groups,
      tokens: result.map((t) => ({
        name: t.name,
        path: t.path.join('.'),
        type: t.type,
        value: t.value,
        description: t.description,
      })),
    });
  },
);

server.tool(
  'get_token',
  'Get one Strake token by CSS variable name (e.g. "--strake-color-accent") or dotted path (e.g. "color.accent"). Read-only.',
  { name: z.string() },
  async ({ name }) => {
    const t = findToken(name);
    if (!t) {
      return asText({ found: false, hint: `Unknown token. ${tokens.length} tokens available — call list_tokens.` });
    }
    return asText({
      found: true,
      token: { name: t.name, path: t.path.join('.'), type: t.type, value: t.value, description: t.description },
    });
  },
);

server.tool(
  'list_components',
  'List Strake components with a category and one-line summary (read-only).',
  {},
  async () =>
    asText({
      count: components.length,
      components: components.map((c) => ({ name: c.name, category: c.category, summary: c.summary })),
    }),
);

server.tool(
  'get_component',
  'Get one Strake component: import, props, accessibility notes, and a usage snippet. Read-only.',
  { name: z.string() },
  async ({ name }) => {
    const c = findComponent(name);
    if (!c) {
      return asText({ found: false, hint: `Unknown component. Available: ${components.map((x) => x.name).join(', ')}.` });
    }
    return asText({ found: true, component: c });
  },
);

// Read-only resources — the whole token set and component catalog as JSON.
server.resource('tokens', 'strake://tokens', async (uri) => ({
  contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(tokenData, null, 2) }],
}));
server.resource('components', 'strake://components', async (uri) => ({
  contents: [
    { uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ count: components.length, components }, null, 2) },
  ],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
// stdout is reserved for the JSON-RPC transport; all logging goes to stderr.
console.error(`strake-mcp ready — ${tokens.length} tokens, ${components.length} components (read-only).`);
