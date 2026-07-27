# TanStack Query — reading notes

_Goes at `notes/tanstack-query.md`_

_Cloned/installed today per Day 2's Escalate step, purely so the source is sitting there for
later. The Tier-A doc read, Build, and Gate for this tool are Day 10 — nothing below should be
mistaken for that read happening early._

## Package contents (npm install, not a doc read) — node_modules/@tanstack/react-query — 2026-07-27

- claim / API: unlike `react` (compiled-only) or `react-router` (organized but compiled `dist/`),
  `@tanstack/react-query`'s published package ships its original `src/*.ts` / `.tsx` source
  alongside the build output — real, commented TypeScript, not just declaration files.
- footgun: n/a yet — nothing read closely enough today to log one.
- Q (unanswered): does `@tanstack/query-core` (the framework-agnostic engine this adapts) ship the
  same way, or is shipping `src/` specific to the React adapter package? Worth checking on Day 10.
