// Copies the token pipeline's metadata output into the MCP package so it can be
// bundled at build time (no runtime filesystem access). Run in `prebuild`.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, '../../tokens/dist/metadata/tokens.json');
const outDir = path.resolve(here, '../src/generated');

try {
  const data = await fs.readFile(source, 'utf8');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'tokens.json'), data);
  const parsed = JSON.parse(data);
  console.log(`✓ strake-mcp: bundled ${parsed.tokenCount} tokens from the pipeline`);
} catch (err) {
  console.error(
    `✖ strake-mcp: could not read ${source}\n  Build the tokens first: pnpm build:tokens`,
  );
  throw err;
}
