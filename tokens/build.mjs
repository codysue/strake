// Strake token pipeline.
//
//   tokens/src/*.tokens.json   (W3C DTCG — the single source of truth)
//        │
//        ▼   Style Dictionary (resolves references, orders dependencies)
//        │
//   dist/css/strake.css        :root + [data-theme="dark"] custom properties
//   dist/tailwind/theme.cjs    a Tailwind theme fragment (var() references)
//   dist/ts/tokens.ts          typed TS constants
//   dist/metadata/tokens.json  flat, agent-readable metadata (feeds the MCP server)
//
// One command — `pnpm build:tokens` — produces all four. Change a value in
// src/ and every output moves together; the tokens:check drift guard fails CI
// if the committed outputs ever fall out of sync. That propagation is the
// whole point of the pipeline.

import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'node:fs';

const PREFIX = 'strake';

// ---- value helpers ----------------------------------------------------------

const valueOf = (t) => t.$value ?? t.value;
const typeOf = (t) => t.$type ?? t.type;

function cssValue(token) {
  const v = valueOf(token);
  if (typeOf(token) === 'cubicBezier' && Array.isArray(v)) {
    return `cubic-bezier(${v.join(', ')})`;
  }
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

// `name/kebab` gives every token a unique, prefixed, kebab-cased name
// (e.g. strake-font-family-sans), which both silences SD's collision check and
// keeps CSS custom properties conventionally kebab-cased.
const cssVar = (t) => `--${t.name}`;
const cssVarRef = (t) => `var(--${t.name})`;

function setDeep(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[path[path.length - 1]] = value;
}

// ---- custom formats ---------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'strake/css',
  format: ({ dictionary, options }) => {
    const selector = options.selector ?? ':root';
    const lines = dictionary.allTokens
      .map((t) => `  ${cssVar(t)}: ${cssValue(t)};`)
      .join('\n');
    const header =
      selector === ':root'
        ? '/* Strake tokens — generated from tokens/src by Style Dictionary. Do not edit by hand. */\n'
        : '';
    return `${header}${selector} {\n${lines}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'strake/ts',
  format: ({ dictionary }) => {
    const refs = {};
    const raw = {};
    for (const t of dictionary.allTokens) {
      setDeep(refs, t.path, cssVarRef(t));
      setDeep(raw, t.path, cssValue(t));
    }
    return (
      '// Strake tokens — generated from tokens/src. Do not edit by hand.\n' +
      '//   `tokens`    — theme-aware CSS variable references (recommended for consumers).\n' +
      '//   `rawTokens` — resolved light-theme values (for tooling that needs concrete values).\n\n' +
      `export const tokens = ${JSON.stringify(refs, null, 2)} as const;\n\n` +
      `export const rawTokens = ${JSON.stringify(raw, null, 2)} as const;\n\n` +
      'export type Tokens = typeof tokens;\n'
    );
  },
});

StyleDictionary.registerFormat({
  name: 'strake/tailwind',
  format: ({ dictionary }) => {
    const colors = {};
    const spacing = {};
    const borderRadius = {};
    const borderWidth = {};
    const fontFamily = {};
    const fontSize = {};
    const fontWeight = {};
    const lineHeight = {};
    const letterSpacing = {};
    const boxShadow = {};
    const transitionDuration = {};
    const transitionTimingFunction = {};

    for (const t of dictionary.allTokens) {
      const [group, ...rest] = t.path;
      const ref = cssVarRef(t);
      const key = rest.join('-');
      switch (group) {
        case 'color':
          setDeep(colors, rest, ref);
          break;
        case 'space':
          spacing[key] = ref;
          break;
        case 'radius':
          borderRadius[key] = ref;
          break;
        case 'border':
          if (rest[0] === 'width') borderWidth[rest.slice(1).join('-')] = ref;
          break;
        case 'fontFamily':
          fontFamily[key] = ref;
          break;
        case 'fontSize':
          fontSize[key] = ref;
          break;
        case 'fontWeight':
          fontWeight[key] = ref;
          break;
        case 'lineHeight':
          lineHeight[key] = ref;
          break;
        case 'letterSpacing':
          letterSpacing[key] = ref;
          break;
        case 'shadow':
          boxShadow[key] = ref;
          break;
        case 'duration':
          transitionDuration[key] = ref;
          break;
        case 'easing':
          transitionTimingFunction[key] = ref;
          break;
        case 'motion':
          if (rest[0] === 'duration') transitionDuration[rest.slice(1).join('-')] = ref;
          else if (rest[0] === 'easing') transitionTimingFunction[rest.slice(1).join('-')] = ref;
          break;
        default:
          break;
      }
    }

    const theme = {
      colors,
      spacing,
      borderRadius,
      borderWidth,
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      boxShadow,
      transitionDuration,
      transitionTimingFunction,
    };

    return (
      '/* Strake Tailwind theme fragment — generated from tokens/src. Do not edit by hand.\n' +
      '   Usage (tailwind.config.js):\n' +
      "     const strake = require('@codysue/strake-tokens/tailwind');\n" +
      '     module.exports = { theme: { extend: strake } };\n' +
      '   Every value is a var() reference, so utilities stay theme-aware in light and dark. */\n' +
      `module.exports = ${JSON.stringify(theme, null, 2)};\n`
    );
  },
});

StyleDictionary.registerFormat({
  name: 'strake/metadata',
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.map((t) => ({
      name: cssVar(t),
      path: t.path,
      group: t.path[0],
      type: typeOf(t) ?? 'unknown',
      value: cssValue(t),
      description: t.$description ?? t.description ?? null,
    }));
    return (
      JSON.stringify(
        { generatedFrom: 'tokens/src', tokenCount: tokens.length, tokens },
        null,
        2,
      ) + '\n'
    );
  },
});

// ---- build ------------------------------------------------------------------

const SHARED = ['src/primitive.tokens.json', 'src/semantic.tokens.json'];

const base = new StyleDictionary({
  usesDtcg: true,
  source: [...SHARED, 'src/semantic.light.tokens.json'],
  platforms: {
    css: {
      prefix: PREFIX,
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [{ destination: '_root.css', format: 'strake/css', options: { selector: ':root' } }],
    },
    ts: {
      prefix: PREFIX,
      transforms: ['name/kebab'],
      buildPath: 'dist/ts/',
      files: [{ destination: 'tokens.ts', format: 'strake/ts' }],
    },
    tailwind: {
      prefix: PREFIX,
      transforms: ['name/kebab'],
      buildPath: 'dist/tailwind/',
      files: [{ destination: 'theme.cjs', format: 'strake/tailwind' }],
    },
    metadata: {
      prefix: PREFIX,
      transforms: ['name/kebab'],
      buildPath: 'dist/metadata/',
      files: [{ destination: 'tokens.json', format: 'strake/metadata' }],
    },
  },
});

const dark = new StyleDictionary({
  usesDtcg: true,
  source: [...SHARED, 'src/semantic.dark.tokens.json'],
  platforms: {
    css: {
      prefix: PREFIX,
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: '_dark.css',
          format: 'strake/css',
          options: { selector: '[data-theme="dark"], .dark' },
          filter: (token) => (token.filePath ?? '').includes('semantic.dark'),
        },
      ],
    },
  },
});

await base.buildAllPlatforms();
await dark.buildAllPlatforms();

// Stitch the light (:root) and dark override blocks into one stylesheet.
const root = await fs.readFile('dist/css/_root.css', 'utf8');
const darkCss = await fs.readFile('dist/css/_dark.css', 'utf8');
await fs.writeFile('dist/css/strake.css', `${root}\n${darkCss}`);
await fs.rm('dist/css/_root.css');
await fs.rm('dist/css/_dark.css');

const meta = JSON.parse(await fs.readFile('dist/metadata/tokens.json', 'utf8'));
console.log(`✓ Strake tokens built — ${meta.tokenCount} tokens → css · tailwind · ts · metadata`);
