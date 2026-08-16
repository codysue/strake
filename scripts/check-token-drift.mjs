#!/usr/bin/env node
// Fails if the generated token outputs in tokens/dist are out of sync with the
// DTCG source. Run *after* `build:tokens`: if rebuilding changed any tracked
// file under tokens/dist, the committed outputs drifted from source — the exact
// failure the "visible pipeline" story promises CI will catch.
import { execSync } from 'node:child_process';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Unstaged/uncommitted changes to tracked files under tokens/dist.
const changed = sh('git status --porcelain -- tokens/dist');

if (changed) {
  console.error('\n✖ Token drift detected.\n');
  console.error('  The committed outputs in tokens/dist/ do not match a fresh');
  console.error('  build from tokens/src/. Someone edited a generated file by');
  console.error('  hand, or changed source without rebuilding.\n');
  console.error('  Fix: run `pnpm build:tokens` and commit the result.\n');
  console.error('  Drifted files:');
  console.error(
    changed
      .split('\n')
      .map((l) => '    ' + l.trim())
      .join('\n'),
  );
  console.error('');
  process.exit(1);
}

console.log('✓ tokens/dist is in sync with tokens/src');
