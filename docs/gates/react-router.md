# Gate — GD: React Router v8 (ESM-only, `react-router-dom` removed)

_Goes at `docs/gates/react-router.md`_

_Written by Claude at direct request, Day 2 (2026-07-27) — same convention as the other
Claude-authored files in this repo, flagged for the same reason._

**The decision.** React Router v8 (GA'd June 17, 2026) is published ESM-only — no CommonJS build
at all — and `react-router-dom` no longer exists as a separate package.

**Why.** ESM-only tracks a real runtime shift, not a style preference: Node 20.19+/22.12+ can
`require()` an ESM module directly now, which used to be the main technical reason projects kept
shipping CJS. Vite 7 had already gone ESM-only before this, so the surrounding tooling had already
moved — React Router wasn't leading that shift, it was catching up to it. `react-router-dom`
specifically was never meant to be permanent: both the [v8 proposal
discussion](https://github.com/remix-run/react-router/discussions/14468) and the [GA
announcement](https://remix.run/blog/react-router-v8) describe it the same way — a re-export shim
published in v7 purely to smooth the v6→v7 migration. Once that migration window closed, there was
no remaining reason to keep publishing it.

**The rejected alternative — and the honest gap.** The obvious alternative was staying
dual-format: keep publishing both CJS and ESM builds (as v7 did), and keep `react-router-dom`
around indefinitely. That's a real alternative, not a strawman — plenty of libraries do exactly
this by choice. But there's no maintainer statement on record explicitly weighing "stay
dual-format" and rejecting it, the way removing `matches` from `ComponentProps` _was_ explicitly
proposed and explicitly rejected in the same discussion thread. The reasoning against staying
dual-format is inferable — it matches the discussion's stated "Less is More" goal, and it matches
the ecosystem-wide ESM shift already underway — but it isn't a quote anyone can point to. That's an
honest gap, not a rejection dressed up to look sourced.

**Sources:** `github.com/remix-run/react-router/discussions/14468` (proposal, opened Oct 2025);
`remix.run/blog/react-router-v8` (GA announcement, June 2026).
