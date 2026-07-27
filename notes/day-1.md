# Incident Console — Day 1 — Final Record

_Was "Day 1 Companion." Day 1 is closed now — this is the record, not a live tracker._

---

## 0. Final status

**Build — done, independently verified (most of it twice, on a fresh clone):**

- [x] Vite 8 + React 19.2 + TS 6.0 scaffolded, `react-ts` template
- [x] `tsconfig.app.json` strict flags — **regressed once** after the first fix (reverted somehow
      between being explained and being pushed), caught on audit, re-fixed, re-verified live
      against the actual committed file
- [x] ESLint (flat config) + `typescript-eslint` + Prettier — real ESLint, not the Oxlint the
      scaffold ships by default; `no-explicit-any` is `"error"`
- [x] Husky + lint-staged — wired correctly, survives a completely fresh clone
- [x] `db.json` — 200 incidents + 8 assignees
- [x] `docs-corpus/` — 9 files, ~119k greppable lines
- [x] `docs/coverage-ledger.csv` — 7 rows logged
- [x] All four Done-when checks — independently re-run, all passing

**Reading + Gate — files exist:**

- [ ] `notes/vite.md`, `notes/react.md`, `notes/typescript.md` — grounded in the actual live docs
      (fetched, not from memory), but you didn't do the reading. Worth actually reading the real
      pages at some point — Day 6 assumes you remember this, not that a file says you do.
- [ ] `docs/gates/toolchain.md` — same caveat, stated once at the top of that file too.

**Never done, by anyone:**

- [ ] The Vite 8 changelog read (the actual reading half of Escalate — the corpus download isn't this)

---

## 1. Where everything ended up (after today's reorg)

```
notes/vite.md              — accumulates across every day that touches Vite
notes/react.md             — accumulates across every day that touches React
notes/typescript.md        — accumulates across every day that touches TS
docs/gates/toolchain.md    — the G5 gate, per the plan's own spec
notes/day-1.md             — this file (renamed from notes/day-1/instructions.md)
notes/day-1-debrief.md     — interview-prep material (renamed from notes/day-1/dbrief.md)
docs/coverage-ledger.csv   — one ledger, all days, all tools
```

Everything under `notes/day-1/*` moved out — see the chat message this came with for the exact
commands. The per-tool files are meant to be **one file per tool, growing over 30 days**, not
one folder per day; a `day-N/` subfolder per day would fragment the same tool's notes across
five different files by the time it matters.

---

## 2. Reading log — still the real template, still worth using yourself

Even though `notes/<tool>.md` has content now, the three-pass method (skim → read → retrieve) is
what the notes are supposed to be proof of. If you go back and do this for real, the format is
still:

```
## <page title> — <url> — <date>
- claim / API:
- footgun:
- Q (unanswered):
```

Vite: Getting Started, Features (skim), Dependency Pre-Bundling — https://vite.dev/guide/
React: Installation, Build a React App from Scratch — https://react.dev/learn/installation
TypeScript: The Basics, Everyday Types — https://www.typescriptlang.org/docs/handbook/2/basic-types.html

---

## 3. Escalate — still open

- [x] `docs-corpus/` populated
- [ ] Read the **Vite 8.0 announcement** — https://vite.dev/blog/announcing-vite8 — and skim the
      **CHANGELOG** — https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md

---

## 4. Setup order that actually works (still correct, still worth keeping)

Relevant again the moment Day 17's Hono swap or any future project needs the same wiring:

1. `git init -b main` — **first**, before anything hook-related.
2. Scaffold, configure ESLint / tsconfig / Prettier.
3. `npm install -D husky lint-staged && npx husky init` — needs `.git` to already exist to set
   `core.hooksPath`, or it silently no-ops (prints a notice, exits `0`).
4. Edit `.husky/pre-commit`, **then `chmod +x .husky/pre-commit`**.
5. _Then_ the first `git add -A && git commit` — the executable bit gets captured correctly from
   the start, so there's no separate "fix permissions" step to forget later.

---

## 5. Trap

`noUncheckedIndexedAccess` makes `arr[0]` resolve to `T | undefined`, not `T`. Only has teeth when
`strictNullChecks` is also on (rides in via `strict: true`) — which is why both have to actually
live inside `compilerOptions`, not just one of them.

---

## 6. Lessons from today

- **`husky init` needs `.git` to already exist**, or it silently no-ops — exits `0`, no error to catch.
- **File permissions are git-tracked content, not filesystem metadata.** An uncommitted `chmod +x`
  evaporates the moment `git reset --hard` lands on a commit that predates it.
- **`git checkout <good-commit> -- <path>` + `commit --amend`** keeps one change while discarding
  another in the same commit — sharper than `reset --hard`, which throws out everything in it.
- **A fix explained in conversation isn't the same as a fix that's actually in the file.** The
  tsconfig regression happened _after_ it was found, fixed, and confirmed once already — verify
  the real committed content each time, not the memory of having fixed it.

---

## 7. Where this lives in `DockerCommonServices`

- Project: `<PROJECTS_BASE>/incident-console` on host → `/projects/incident-console` in the
  `workstation` container. `WS_PORTS_C` covers Vite's default `5173`; `WS_PORTS_B` covers
  `json-server`'s default `3000`. No other service in that repo is needed yet.
