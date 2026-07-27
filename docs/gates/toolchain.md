# Gate — G5: Toolchain (Vite / TypeScript / ESLint)

_Goes at `docs/gates/toolchain.md`_

Five things I'd tell a new hire about how these three fit together on this project.

1. **Rolldown collapsed two bundlers into one.** Vite used to run esbuild in dev and Rollup for
   production builds — two pipelines, two plugin systems, and a standing risk that dev and prod
   would quietly disagree. Rolldown is a single Rust bundler with a Rollup-compatible plugin API
   that does both jobs now, so what you see locally is what ships.

2. **The four strict flags each close a specific gap `strict: true` alone leaves open.**
   `exactOptionalPropertyTypes` stops code from writing `undefined` into an optional field that was
   never typed to allow it. `noUncheckedIndexedAccess` makes `arr[i]` come back `T | undefined`,
   since JS never guarantees an index exists. `noImplicitOverride` forces the `override` keyword so
   a renamed base method doesn't silently orphan a subclass override. All four have to live inside
   `compilerOptions` — a top-level typo silently disables them with zero warning, verified the hard
   way today.

3. **`tsc` and `typescript-eslint` own different halves of "is this code okay."** `tsc` is the type
   checker — strict-mode violations are its job. `typescript-eslint`, wired to type info via
   `strictTypeChecked`, adds rules `tsc` has no opinion on, like banning `any` outright (which is
   syntactically legal TypeScript). Both need the same tsconfig to resolve types, which is why
   `eslint.config.js`'s `parserOptions.project` points at it directly.

4. **A hook that never runs looks identical to a hook that ran clean.** `lint-staged` only checks
   staged files by design — cross-file type errors need `npm run build`'s full `tsc -b`, not the
   pre-commit hook. And a genuinely broken hook (wrong `core.hooksPath`, wrong file permission)
   produces the exact same outward signal as a working one, until you deliberately try to break it.

5. **`db.json` is scaffolding, not the app.** It's a static file standing in for a backend so UI
   work isn't blocked on one — Day 17 replaces it with a real Hono API once actual server-side
   validation is needed.

**Bonus, earned outside the original five:** file permissions are git-tracked commit content, not
live filesystem state — an uncommitted `chmod +x` on a hook script evaporates the moment
`git reset --hard` lands on a commit that predates it.

---
