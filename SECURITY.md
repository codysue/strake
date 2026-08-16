# Security

Strake ships three things a security reviewer should think about: an npm package
(`@codysue/strake`), a token build step, and an optional MCP server
(`@codysue/strake-mcp`). Here is the honest threat model for each.

## The MCP server (`@codysue/strake-mcp`)

The server exists to demonstrate one idea — *a design system as a queryable API for
agents* — without becoming a liability. It is deliberately built to the smallest
capability set that makes that point.

**What it is**

- A **local stdio** server, the same model as any MCP tool you add to your own
  client. It is started by whoever chooses to run it, on their own machine. It is
  **not** a hosted, network-facing service. There is no inbound port, no listener,
  nothing on the public internet for a stranger to reach. Installing or publishing
  it does not expose the author to inbound attack.
- A reader over **static, already-public data**: the token values and component
  metadata that also live in this repo, in the published npm package, and in
  Storybook. There is no secret in the payload, so there is nothing to exfiltrate.

**What it can do — and cannot**

| Capability | Status |
| --- | --- |
| Read bundled token/component JSON | ✅ the only thing it does |
| Write files, mutate state | ❌ none |
| Execute commands / spawn processes | ❌ none |
| Open sockets / make network requests | ❌ none |
| `eval` / dynamic code | ❌ none |
| Filesystem access beyond its bundled metadata | ❌ none |

**Injection surface.** Tool inputs (a token or component name) are treated as
**opaque lookup keys**: normalized, exact-matched against a known, finite key set,
and used only as object keys or array-filter predicates. They are never
interpolated into a shell command, a SQL query, a file path, a URL, or `eval`. An
unknown key returns a plain "not found" result. This closes command/path/SQL
injection by construction.

**Prompt-injection surface.** The text the server returns is the author's own
curated, build-time-generated metadata — not attacker-controlled third-party
content flowing through to a downstream model. (If a third party forks Strake and
puts adversarial strings in *their own* token descriptions, the only agent that
could mislead is one they themselves point at their own fork.)

**Supply chain.** The package has no `postinstall`/lifecycle scripts and a minimal
dependency set (the MCP SDK and a schema validator). Its metadata is generated from
this repo at build time, not fetched at runtime.

Net: read-only, local, static, no exec/network/write, inputs treated as opaque
keys. Publishing it is safe.

## The component library (`@codysue/strake`)

Standard front-end library hygiene: no network calls, no `dangerouslySetInnerHTML`
of consumer-supplied strings, no `eval`. Peer-dependency on React; runtime
dependencies limited to well-known, audited primitives (Floating UI for
positioning). Consumers render their own content into components; Strake does not
transport it anywhere.

## Reporting

This is a personal portfolio project. If you find something, open an issue with the
`security` label, or reach the author through the contact on the profile linked in
the repo. No bounty, but real thanks.
