# Incident Console — Day 1 Companion
### Setup, corpus, and the ledger

This is your working copy of Day 1 — pulled out of the master plan so you don't have to scroll a
450-hour document to find today's targets. Fill in the reading log as you go (own words, per the
plan's three-pass method: skim → read → retrieve). Nothing here is pre-filled with content — that
part is yours; this is just the scaffolding.

---

## 1. Reading log (Tier A) — fill this in as you read

Copy each block below into `notes/<tool>.md` once you've filled it in.

### Vite — Getting Started
Read: **Getting Started**, skim **Features**, read **Dependency Pre-Bundling**
Link: https://vite.dev/guide/
```
## <page title> — <url> — 2026-07-26
- claim / API:
- footgun:
- Q (unanswered):
```

### React — Installation
Read: **Installation**, and **Build a React App from Scratch**
(the master plan calls the second one "Start a New React Project" — react.dev restructured that
page; this is its current name/URL)
Links: https://react.dev/learn/installation · https://react.dev/learn/build-a-react-app-from-scratch
```
## <page title> — <url> — 2026-07-26
- claim / API:
- footgun:
- Q (unanswered):
```

### TypeScript Handbook — The Basics + Everyday Types
Links: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
· https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
```
## <page title> — <url> — 2026-07-26
- claim / API:
- footgun:
- Q (unanswered):
```

---

## 2. Escalate

- [ ] `docs-corpus/` populated (see Step 13 in chat) — confirmed-live bundles: Vite, Vitest, Zod,
      Next.js, Hono (llms-full.txt) + shadcn/ui, react.dev, TanStack (llms.txt index only).
- [ ] Read the **Vite 8.0 announcement** — https://vite.dev/blog/announcing-vite8 — and skim the
      **CHANGELOG** — https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md — for
      what esbuild → Oxc changed under the hood.

---

## 3. Build checklist

- [ ] Project folder created under your workstation's `/projects` mount
- [ ] Vite 8 + React 19.2 + TS 6.0 scaffolded (`react-ts` template)
- [ ] Dev server reachable from the host browser (`--host`, port in `WS_PORTS_C`)
- [ ] `tsconfig.app.json`: `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`,
      `noImplicitOverride`
- [ ] ESLint (flat config) + `typescript-eslint` + Prettier wired — **not** the Oxlint the
      scaffold ships by default (see chat Step 3)
- [ ] Husky + lint-staged: `.husky/pre-commit` runs `lint-staged`; `@typescript-eslint/no-explicit-any`
      is `"error"`
- [ ] `db.json` with 200 synthetic incidents (+ an `assignees` collection for Day 11)
- [ ] `src/{app,features,shared,lib}` created
- [ ] `docs/coverage-ledger.csv`, `notes/`, `docs/gates/`, `docs-corpus/` initialized

---

## 4. Done when (all four must pass)

```bash
# 1 — the trap check: any is rejected by the pre-commit hook
#     (see chat Step 9 for the full add/attempt/restore sequence)

# 2 — build passes
npm run build                     # expect: exit 0

# 3 — corpus present and greppable
rg "." docs-corpus/ | wc -l       # expect: non-zero

# 4 — ledger exists
test -f docs/coverage-ledger.csv && echo OK
```

---

## 5. Trap

`noUncheckedIndexedAccess` makes `arr[0]` resolve to `T | undefined`, not `T`. Any code that
indexes an array without a guard will stop compiling. That's the flag doing its job — don't
loosen it to make old habits compile.

---

## 6. Gate — G5 for the toolchain

Write **five things you'd tell a new hire** about how Vite, TypeScript, and ESLint work together
on this project. Don't answer these here — write them cold, in `docs/gates/toolchain.md`, then
paste them back to me and I'll pressure-test them. Prompts to get you started:

1. What does Rolldown actually replace, and why does that collapse two bundlers into one?
2. Why these four strict-mode flags specifically — what bug does each one prevent?
3. Where does `typescript-eslint` stop and plain `tsc` start — which of today's checks does each one own?
4. What's one way the pre-commit hook could pass locally but still let something bad through?
5. Why is `db.json` explicitly temporary (name the day it gets replaced, and by what)?

---

## 7. Where this lives in `DockerCommonServices`

- Project folder: `<PROJECTS_BASE>/incident-console` on your host → `/projects/incident-console`
  in the `workstation` container. **Check your real `PROJECTS_BASE`** — your README's examples
  and your `.env.example` template don't agree (see chat Step 0).
- Enter via `dev` from that folder. Everything below runs **inside** that shell.
- Vite dev server → published port range `WS_PORTS_C` (`5173-5180`) — Vite's default `5173` needs
  no config change.
- `json-server` → published port range `WS_PORTS_B` (`3000-3010`) — default `3000` needs no
  config change either.
- No other service in this repo (Postgres, Redis, etc.) needs to be running for Day 1 — just
  `workstation`. They stay dormant until you actually need them.

---

## 8. Coverage ledger — today's header row

```csv
tool,doc_section,tier,pages,date_read,hours,gate_passed(y/n),open_question
```
Add one row per section you actually finish today; don't backfill hours you didn't track.