# Contributing to Strake

Strake is small on purpose. Contributions that keep it small, accessible, and honest are welcome.

## Before you open a PR

Run the five checks locally. CI runs the same ones.

    pnpm install --frozen-lockfile
    pnpm tokens:check      # rebuilds tokens and fails if tokens/dist drifted from tokens/src
    pnpm typecheck
    pnpm build:react
    pnpm build:mcp
    pnpm build:storybook

## Rules that bite

- `tokens/dist` is generated. Never edit it by hand; change `tokens/src` and run `pnpm build:tokens`.
- A component's public props are its API. Changing them changes the MCP catalog and the Storybook stories in the same PR.
- Every interactive component stays keyboard-operable and axe-clean in its story, light and dark.
- No network calls in the library, the MCP server, or (when it lands) the Figma sync plugin.

## Branches and commits

- Branch from `main`; name it `<initials>/<short-description>`.
- Subjects use the conventional form already in the log: `feat:`, `fix:`, `chore:`, `docs:`, `ci:`.
- Attribution: commits carry the author who wrote the diff. When an agent wrote the diff, add its co-author trailer.

## Review

`main` is protected: a PR, a passing `build` job, and one approving review. Reviewers check the five checks, the rules above, and that generated files match source.
