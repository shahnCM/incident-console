# React — reading notes

_Goes at `notes/react.md`_

## Installation — https://react.dev/learn/installation — 2026-07-26

- claim / API: react.dev splits "getting started" into three explicit paths rather than one
  recommendation: use a framework, build from scratch with a bundler, or add React into an
  existing non-React page. Create React App is called out by name as deprecated — the page says
  plainly not to use it.
- footgun: none really — this page is mostly a router to the other three. The actual risk is
  picking "build from scratch" without reading that page first and not registering what's being
  opted out of.
- Q (unanswered): the plan already committed to Vite (the scratch path), which the "Build a React
  App from Scratch" page frames as a tradeoff, not a default — worth being clear-eyed about what's
  actually being given up (see below).

## Build a React App from Scratch — https://react.dev/learn/build-a-react-app-from-scratch — 2026-07-26

- claim / API: React's own docs are explicit that scaffolding with a bundler (Vite/Parcel/Rsbuild)
  gets a client-only SPA and nothing else — no router, no data fetching, no styling solution.
  Everything past that is framed as "you now own framework-shaped problems": routing, loading/error
  states for data fetching, code-splitting, and eventually choosing between SPA/SSR/SSG/RSC
  rendering strategies.
- footgun: the page frames "starting from scratch" as functionally "building your own ad-hoc
  framework" — future React features that need framework-level integration (their named example:
  RSC) have to be hand-rolled if ever needed, since there's no framework underneath.
- Q (unanswered): this plan explicitly chooses scratch + Vite for the SPA phase, then adds a real
  framework later for the Day 27 RSC exploration — is that switch meant to demonstrate the exact
  gap this page describes, side by side?

---

## Day 2 additions — 2026-07-27

## Rules of React (Overview) — https://react.dev/reference/rules — 2026-07-27

- claim / API: Exactly three rules, each with its own subpage: **Components and Hooks must be
  pure**, **React calls Components and Hooks**, **Rules of Hooks**. The page is explicit these are
  rules, not style preferences — quoting it directly would violate the copyright limits I'm under,
  but the framing is: break one and your app has real bugs, not just non-idiomatic code. Recommends
  running Strict Mode alongside the official ESLint plugin so violations surface instead of
  lurking.
- footgun: the overview's own one-line summary of rule 1 undersells it — it summarizes "Components
  and Hooks must be pure" as just "must be idempotent," but the actual subpage's purity definition
  has four more clauses beyond idempotency (see next entry). Skimming only this page and skipping
  the subpage leaves 4/5 of the purity rule unread.
- Q (unanswered): is "idempotent" one clause _of_ "pure," or are the two ever used interchangeably
  elsewhere in the docs? Worth watching for on Day 3–6 when purity comes up again around Effects.

## Components and Hooks must be pure — https://react.dev/reference/rules/components-and-hooks-must-be-pure — 2026-07-27

- claim / API: Purity = idempotent (same inputs → same output) **+** no side effects during render
  **+** never mutates a non-local value. Local mutation is explicitly fine — building an array
  inside the component body and `.push()`-ing into it before returning JSX is fine, because that
  array doesn't survive to the next render. What's not fine is mutating something declared
  _outside_ the component (a module-scope array, `window.__x`, a mutated prop). Props, state, hook
  return values, and even hook _arguments_ are all treated as immutable snapshots — mutating a hook
  argument after the fact can silently invalidate that hook's own memoization.
- footgun: "lazy initialization" (e.g. calling a library's `initializeIfNotReady()` during render)
  is explicitly called out as fine despite not being textbook-pure — React's actual bar is
  idempotency + no _visible_ side effects, not strict functional purity. Separately: values become
  immutable the moment they're passed into JSX — mutating an object _after_ constructing
  `<Header styles={styles}/>` but before the function returns can produce a stale UI, since React
  may evaluate that JSX eagerly.
- Q (unanswered): the module-scope-array-mutation example is a real bug per the docs, but is there
  actually a lint rule that catches it, or is that one only catchable by code review? (Hook-call
  order violations are traceable by a linter; this kind of mutation isn't obviously the same kind
  of static check.)

## React Reference Overview — https://react.dev/reference/react — 2026-07-27

- claim / API: Six sections map the whole Reference surface: **React** (Hooks / Components / APIs
  / Directives), **React DOM** (Hooks / Components / APIs / Client / Server / Static — six
  sub-areas on its own), **React Compiler** (Configuration / Directives / Compiling Libraries),
  **ESLint Plugin React Hooks**, **Rules of React** (the three pages above), **Legacy APIs**.
  "Directives" here links to the RSC `use client`/`use server` pages — it's the 4th bullet under
  the plain "React" heading, not its own section.
- footgun: **React Server Components has no top-level heading on this page at all** — it's only
  reachable via that one buried "Directives" link. `react.dev/llms.txt` (read right after this,
  below) treats "React Server Components" as its _own_ top-level category with two full pages
  (Server Components, Server Functions) plus its own Directives sub-section. Same content, two
  official sources, two different shapes — first real example this program has hit of exactly the
  thing §13 of the master plan warns about.
- Q (unanswered): is RSC's low visibility on this page deliberate (not relevant to a plain client
  SPA like this one) or just a page that hasn't been reconciled with whatever generates the llms.txt
  index? Neither React DOM nor React Compiler get their own llms.txt-vs-page shape mismatch — worth
  noting if this is an RSC-specific pattern or a one-off.

## react.dev/llms.txt (index shape) — https://react.dev/llms.txt — 2026-07-27

- claim / API: 249 lines, already sitting in `docs-corpus/react-llms.txt` from Day 1. Two top-level
  parts: **Learn React** (Get Started + the same five Learn categories as the live nav) and **API
  Reference** — seven categories here (React / React Dom / React Compiler / ESLint Plugin / Rules
  Of React / **React Server Components** / Legacy APIs), one more than the live `/reference/react`
  page's six, because RSC gets its own heading in this file specifically. Every entry links to a
  `.md` version of the page (`useEffect.md`, not `useEffect`) — this is a parallel, machine-readable
  content tree, not a sitemap of the human site.
- footgun: it is a **pure link index** — zero descriptive text under any entry beyond the title
  itself. "Internalizing doc shape" from this file alone means memorizing structure, not content;
  every actual fact still requires opening the linked `.md`.
- Q (unanswered): the master plan describes this file as a "minimal link index" — after actually
  reading it, does "minimal" mean _link-only, no prose_ specifically, rather than _short_? 249
  fully-categorized lines isn't short. Worth testing that reading against vite's file (`notes/vite.md`),
  which is much shorter but opens with several paragraphs of prose react's file never has.
