# Incident Console — Day 1 Debrief

### Interview prep + lessons, built from today's actual work

One honesty note before this: I don't have your Tier-A reading (Vite Getting Started, React
Installation, TS Handbook) — you haven't shared what you found there, and I'm not going to invent
notes and pass them off as yours. Once you've got even a rough first pass in `notes/`, paste it
here and I'll fold a proper "readings" section into this doc, for real.

What I _do_ have full, accurate visibility into is everything we actually did and debugged today —
so that's what this note is built from: the toolchain decisions (framed as interview Q&A, since
that's the format you asked for) and the husky/git saga (which, told right, is genuinely good
interview material).

One flag on Part 1, stated once: the plan's Gate (§6 in the companion doc) wants you to write
these five answers **cold**, then compare. What's below are model answers — useful to check your
own against, not a substitute for writing your own first. If you already did that, ignore this
paragraph and use these as your pressure-test.

---

## Part 1 — Toolchain Q&A (model answers)

**Q1. What does Rolldown actually replace, and why does that collapse two bundlers into one?**
Vite ran two separate bundlers for years: esbuild for dev-server speed (TS/JSX transforms,
dependency pre-bundling), Rollup for optimized production builds. Two pipelines meant two plugin
systems and a standing risk that dev and prod behavior would quietly diverge. Rolldown is a single
Rust-based bundler with a Rollup-compatible plugin API that does both jobs — what runs in dev is
what ships in prod. Vite 8 also moved the transform layer (esbuild's old job) to Oxc, a companion
Rust toolchain from the same team.

**Q2. Why these four strict-mode flags specifically — what bug does each one prevent?**

- `strict` — the baseline bundle (`strictNullChecks`, `noImplicitAny`, etc.). Without it, `null`/
  `undefined` aren't tracked and untyped values pass silently.
- `exactOptionalPropertyTypes` — makes `{ a?: string }` mean "string, or the key is absent," not
  "string, or explicitly `undefined`." Catches code that assigns `undefined` to an optional field
  the type never actually allowed.
- `noUncheckedIndexedAccess` — `arr[i]` returns `T | undefined` instead of `T`, because JS never
  guarantees an element exists at any given index.
- `noImplicitOverride` — forces the `override` keyword when overriding a base method, so renaming
  a base method doesn't silently orphan a subclass override that no longer overrides anything.

`noUncheckedIndexedAccess` only bites because `strict` turns on `strictNullChecks` — the two are a
pair, which is exactly why having them split across the top level and `compilerOptions` (today's
first bug) broke both at once, not just one.

**Q3. Where does `typescript-eslint` stop and plain `tsc` start — which of today's checks does each one own?**
`tsc` is the type checker: it owns "does this code type-check," including all four strict flags —
`arr[0].toFixed()` without a guard is a `tsc` error. `typescript-eslint` is a linter that _can_ use
`tsc`'s type information (`strictTypeChecked`) to add rules `tsc` has no opinion on — `no-explicit-any`
is syntactically valid TypeScript; `tsc` will compile it without complaint. Today's Done-when #1
(the `any` test) was purely an ESLint concern. Done-when #2 (`npm run build`, which runs `tsc -b`)
is purely a `tsc` concern. Both need the same `tsconfig` to resolve types, which is why
`eslint.config.js`'s `parserOptions.project` points at `tsconfig.app.json` / `tsconfig.node.json`.

**Q4. What's one way the pre-commit hook could pass locally but still let something bad through?**
`lint-staged` only touches staged, changed files by design — a full `tsc --noEmit` isn't in the
hook because cross-file type errors need the whole project graph, and scoping that to staged files
alone gives misleading results. So a change that's locally clean could still break an _unstaged_
file's types, and the hook would pass anyway; only `npm run build` or CI would catch it. This is
also exactly why the husky wiring itself could fail silently today — a hook that never runs
"passes" trivially, and that looks identical from the outside to a hook that ran and found nothing
wrong. Passing and _not running_ produce the same green checkmark.

**Q5. Why is `db.json` explicitly temporary — name the day it gets replaced, and by what?**
Day 17 swaps `json-server` for a real Hono API. `json-server`'s only job was unblocking UI work
before a real backend exists — it can't do real validation with typed error responses, which the
Day-17 form work (`react-hook-form` + `zodResolver`, mapping server `422`s to `setError`) needs.

**Bonus Q6 (earned today, not in the original five). What's one way a git operation can silently undo a fix that looks applied?**
A tracked file's Unix permissions — the executable bit on a hook script, say — are part of what
git commits, not just live filesystem state. `chmod +x` on a tracked file is a real but
_uncommitted_ change. `git reset --hard <commit>` restores the working tree to exactly what that
commit recorded, permissions included, so an uncommitted permission fix vanishes the moment you
reset past it — with nothing on screen telling you it just happened.

---

## Part 2 — "Tell me about a bug you debugged" (a real one, from today)

Common interview question, and you now have a genuinely good, specific answer instead of a
made-up one. Rough shape:

**Situation.** Fresh Vite + React + TypeScript project, with a pre-commit hook meant to reject any
commit containing an explicit `any` type.

**Task.** Prove the hook actually works — deliberately commit a violation, expect it rejected.

**Action, attempt 1.** The commit went through when it shouldn't have. Root cause: `husky init` had
run _before_ `git init` — husky needs an existing repo to wire `git config core.hooksPath`. Without
one, it printed `.git can't be found` and exited `0`. No error a script or a glance at the terminal
would catch; it just quietly never pointed git at `.husky/` at all. Fix: `git config core.hooksPath
.husky`, applied directly, no need to rerun `husky init` (which would've overwritten the already-
customized hook file back to its sample content).

**Action, attempt 2.** Still passed — new symptom this time, git explicitly naming the hook file as
"ignored because it's not set as executable." Ran `chmod +x`, confirmed it with `ls -l`. Then used
`git reset --hard` to clear out two junk commits from the failed attempts — which silently reverted
the chmod too, because the permission change had never actually been committed. Git tracks file
mode as part of a commit's recorded tree, not as live filesystem metadata that persists independent
of history.

**Action, attempt 3.** Re-applied the chmod, this time committed it properly. A second, smaller
version of the same class of bug showed up — the commit meant to carry _just_ the permission fix
had also picked up a leftover line from an earlier test that never got cleaned up. Fixed by
restoring that one file from a known-good commit (`git checkout <good-commit> -- <path>`) and
folding the result into a clean `--amend`, rather than another blunt `reset --hard`.

**Result.** Verified end-to-end in a throwaway sandbox — same dependency versions, same config,
correct init order — before trusting it against the real repo again. Confirmed working: the hook
now reliably blocks non-compliant commits, and the fix survives a fresh clone rather than living
only in one uncommitted local state.

**The one-line version, if asked to keep it short:** "A pre-commit hook that looked wired up wasn't
actually running, because the tool that installs git hooks needs a git repo to already exist —
and the fix for that revealed a second, unrelated lesson: git tracks file permissions as commit
content, so an uncommitted `chmod` doesn't survive a hard reset."

---

## Part 3 — Quick-fire lessons (everything flagged today, in one place)

- **Vite 8's `react-ts` scaffold ships Oxlint by default now, not ESLint.** The plan wants classic
  ESLint + `typescript-eslint` (later days lean on ESLint-only plugins) — swap it, don't assume the
  scaffold matches the plan.
- **`erasableSyntaxOnly: true` means no `enum` and no constructor parameter-property shorthand**
  anywhere in this codebase — both need runtime code TS can't just strip. Use string-literal unions
  instead (already how `status`/`severity` are modeled in the seed data).
- **`verbatimModuleSyntax: true` means type-only imports need `import type` explicitly** — the
  first type you import without it will error, not silently work.
- **`lib` needs `DOM.Iterable`, not just `DOM`,** or `for...of` over a `NodeList` / `FormData.entries()`
  won't type-check. Doesn't bite on Day 1; will by Day 17–18.
- **TypeScript 7.0 (the Go-based compiler) has gone stable on npm's `latest` tag.** Per the plan's
  own stated threshold, stay on `6.0.3` for this program — pin it explicitly in `package.json` so a
  future plain `npm install` can't pull 7.0 out from under you.
- **Your `DockerCommonServices` README's example paths and its `.env.example` disagree on
  `PROJECTS_BASE`.** Docs and config drift apart in real repos; check the live value, don't trust
  the example.
- **A misplaced tsconfig key doesn't error — it's just silently ignored.** `strict` and friends sitting
  outside `compilerOptions` compiled clean, with none of the protection they were supposed to add.
  Verified this directly rather than assuming it.
- **`husky init` before `git init` fails silently** (exit `0`, easy to miss).
- **File permissions are git-tracked content** — commit the `chmod`, don't just apply it.
- **`git reset --hard` reverts permissions too**, if they were never committed.
- **`git checkout <commit> -- <path>` + `commit --amend`** is the clean way to keep one change
  while discarding another inside the same commit — sharper than a blunt `reset --hard`.

---

_Companion doc (`incident-console-day-01`) still owns the live checklist and reading templates —
this one's for review and reuse, not tracking._
