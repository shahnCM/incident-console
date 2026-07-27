# React Router — reading notes

_Goes at `notes/react-router.md`_

_React Router's own Tier-A doc read (reactrouter.com — Start, Routing, Data/Actions, Middleware,
Framework/Vite, API) happens Day 8 — this file starts early because Day 2's **Escalate** step
targets Router's v8 discussion and changelog specifically. Everything below is escalation-ladder
material (rung 3: RFC/discussion, and rung 2: changelog/announcement), not the doc read itself._

_Sourced from the live pages today (fetched, not memory). This is raw material for the Day 2 GD
gate — write the gate cold from what's below, don't copy these bullets into it directly._

## React Router v8 (proposal discussion) — https://github.com/remix-run/react-router/discussions/14468 — 2026-07-27

- claim / API: Opened Oct 23, 2025 by maintainer brookslybrand as a public roadmap-scoping thread
  (category: Proposals), stayed open and got amended through the June 17, 2026 GA. Three stated
  design goals frame the whole thread: **"Less is More"** (shrink API surface without losing
  capability), **"Simple Migration Paths"** (breaking changes ship behind future flags first,
  deprecations get marked ahead of removal), **"Regular Release Cadence"** (~yearly majors).
  Concretely marked accepted (✅) here: drop CJS builds and go ESM-only; Node 22.12 as the proposed
  minimum (see footgun — this changed by GA); React 19.2.5 minimum; Vite 7 minimum; and **remove
  `react-router-dom` entirely**, with the reason given directly in-thread: it was only ever
  published in v7 "as a re-export of everything from react-router to ease migration" — i.e. a
  temporary shim, not a package meant to live forever.
- footgun: the Node-version number that actually **shipped** (22.22.0+, confirmed in the GA
  announcement below) is higher than what this discussion proposed and marked ✅ back in Nov 2025
  (22.12). An "accepted" number in an 8-month-old design discussion is not the final answer —
  always cross-check the last primary source in the ladder before citing a specific version from a
  discussion thread, even one the maintainers already voted on.
- Q (unanswered): a rejected alternative _is_ on record in this thread, just not for
  `react-router-dom` specifically — removing `matches` from `ComponentProps` was proposed and
  explicitly rejected (kept, because Server Components can't use hooks and need a non-hook way to
  read route matches), and `unstable_optimizeDeps` removal was proposed and explicitly deferred
  ("no changes currently planned"). Is there a sub-thread that frames "keep publishing
  `react-router-dom` / stay dual CJS+ESM" as considered-and-rejected in those same terms, or was
  ESM-only uncontested from the moment it was proposed? Still open — didn't chase this one down
  today, it's a fine thing to leave for the Gate to note honestly as unresolved.

## React Router v8 (release announcement) — https://remix.run/blog/react-router-v8 — 2026-07-27

- claim / API: GA'd June 17, 2026. Confirmed final baselines: **Node 22.22.0+, React 19.2.7+, Vite
  7+**. Package is now published ESM-only; tsconfig `target`/`lib` bumped to ES2022 project-wide.
  `react-router-dom` removed — the official one-line reason matches the discussion almost verbatim:
  "It was just a mirror of react-router to help smooth the v6 → v7 upgrade. If you're still using
  it, you can safely remove it." New Node-support policy stated going forward: all Active LTS
  versions are supported, but for Maintenance LTS, only the _latest minor branch_ — meaning the
  minimum Maintenance-LTS version can now rise in a **minor** release, not just a major.
- footgun: the post says it's "quoting directly from our design goals" and lists **four**: "Less is
  More, Routing and Data Focused, Simple Migration Paths, Lowest Common Mode." **Resolved below —
  the quote itself was incomplete.**
- Q (unanswered): ~~worth fetching the live `GOVERNANCE.md#design-goals` directly~~ — **done, see
  next entry.**

## GOVERNANCE.md (live source, single-file fetch, not a full clone) — https://raw.githubusercontent.com/remix-run/react-router/main/GOVERNANCE.md — 2026-07-27

- claim / API: **The canonical list is five goals, not three or four.** In order: Less is More,
  Routing and Data Focused, Simple Migration Paths, **Lowest Common Mode**, **Regular Release
  Cadence**. Both earlier sources were each partially right: the Oct 2025 discussion's opening post
  only mentioned three (missing "Routing and Data Focused" and "Lowest Common Mode" — these two
  were apparently added to governance sometime _during_ the 8-month discussion window); the June
  2026 blog post's "direct quote" of four _dropped_ "Regular Release Cadence" even though that goal
  is still live in the actual document and the practice is still described in the post's own prose,
  just not included in its quoted list.
- footgun: **this didn't require the full `git clone` to resolve** — a single `curl` of the raw
  file was enough (`curl -O https://raw.githubusercontent.com/remix-run/react-router/main/GOVERNANCE.md`).
  Worth remembering the ladder doesn't always mean "clone the whole repo" — sometimes rung 4
  (source) is one specific file, fetchable directly, no clone required.
- Q (unanswered): none — this one's closed. Two out of three primary sources on the same claim
  were each incomplete in different directions; only checking all three caught it.
