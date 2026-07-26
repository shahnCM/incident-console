# Vite — reading notes

_Goes at `notes/vite.md`_

## Getting Started — https://vite.dev/guide/ — 2026-07-26

- claim / API: Vite is two things — a dev server serving native ES modules with fast HMR, and a
  build command that now bundles through Rolldown instead of Rollup/esbuild. Scaffold via
  `npm create vite@latest`, or install `vite` directly and point it at any folder with an
  `index.html`; that file (not something buried in `public/`) is the actual entry point and part
  of the module graph.
- footgun: dev-mode target is `esnext` by default — Vite deliberately doesn't lower syntax for you
  locally, so something that runs fine in `npm run dev` can still fail on an older real browser at
  `npm run build` if the build target isn't set explicitly.
- Q (unanswered): the "Baseline Newly Available" browser target is pinned to a date per major
  release (2026-01-01 for this line) — does upgrading Vite _minor_ versions later silently shift
  which browsers dev mode assumes, or is it locked at the major?

## Features (skim) — https://vite.dev/guide/features — 2026-07-26

- claim / API: Vite transpiles `.ts` files but deliberately does _not_ type-check them — that's
  treated as a separate concern for the IDE or a parallel `tsc --noEmit` process, same as it treats
  ESLint as separate. `isolatedModules: true` has to be set in tsconfig because the Oxc transformer
  works file-by-file with no type information, so it can't support things like `const enum`.
- footgun: `tsconfig.json`'s own `target` field is ignored by Vite — dev-mode transform target is
  controlled by Vite's own `oxc.target` config, not the TS compiler option. Setting `target` in
  tsconfig changes what `tsc` checks against, not what Vite actually ships to the browser.
- Q (unanswered): since type-checking is explicitly not Vite's job, is `npm run build`
  (`tsc -b && vite build`) our only real gate against shipping type errors, or does something else
  in the chain also catch them before that?

## Dependency Pre-Bundling — https://vite.dev/guide/dep-pre-bundling — 2026-07-26

- claim / API: On first run, Vite scans source for bare imports (`import x from 'some-pkg'`) and
  pre-bundles each into a single ESM file in `node_modules/.vite`, using Rolldown. Two reasons:
  converting CJS/UMD deps to ESM, and collapsing packages with hundreds of internal files (their
  example: `lodash-es` has 600+) into one request instead of hundreds.
- footgun: the pre-bundle cache is invalidated by lockfile changes, not by editing a
  locally-linked package's source — if working on a monorepo dependency and it's not being picked
  up, `--force` or clearing `node_modules/.vite` is the fix, not just restarting the dev server.
- Q (unanswered): does our project have any dependency large/CJS enough that pre-bundling behavior
  is actually worth watching, or is this mostly invisible at our current dependency count?
