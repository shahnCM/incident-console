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

## Day 3 — Describing the UI (full chapter) + Render and Commit + State as a Snapshot

### Your First Component — https://react.dev/learn/your-first-component

- claim/API: a component is an ordinary JS function, name capitalized, that returns markup; a component must return one root element (or a Fragment wrapping several).
- footgun: defining a component function _inside_ another component's function body creates a brand-new component type on every parent render, which resets all of that child's state. Always define components at the module's top level.
- Q (unanswered):

### Importing and Exporting Components — https://react.dev/learn/importing-and-exporting-components

- claim/API: a file has at most one default export (imported under any name, no braces) but can have many named exports (imported under their exact name, in braces).
- footgun: mixing default-export and named-export syntax inconsistently across a codebase makes it easy to import the wrong thing with the wrong syntax; pick one convention per file and stay consistent.
- Q (unanswered):

### Writing Markup with JSX — https://react.dev/learn/writing-markup-with-jsx

- claim/API: JSX requires a single enclosing tag per return (use `<>...</>` for a Fragment when there's no natural wrapper); most attributes are camelCase (`className`, `onClick`), not the HTML lowercase form.
- footgun: an unclosed self-closing tag (`<img>` instead of `<img />`) or multiple sibling root elements without a Fragment is a compile error, not a warning.
- Q (unanswered):

### JavaScript in JSX with Curly Braces — https://react.dev/learn/javascript-in-jsx-with-curly-braces

- claim/API: `{}` opens a window from JSX back into JS, usable for attribute values or text content; only **expressions** are legal inside (ternaries, function calls, arithmetic), not statements.
- footgun: you cannot put an `if` or a `for` loop directly inside `{}`; the double-brace look of `style={{ color: 'red' }}` is just a single JS object literal sitting inside one pair of JSX braces, not special syntax.
- Q (unanswered):

### Passing Props to a Component — https://react.dev/learn/passing-props-to-a-component

- claim/API: props flow one direction, parent → child; destructure them in the function signature; `{...props}` spreads all of them through; a destructured default (`{ color = 'blue' }`) supplies a fallback.
- footgun: props are read-only from the child's side — mutating an object or array received as a prop leaks that mutation back into the parent's data, since it's the same reference.
- Q (unanswered):

### Conditional Rendering — https://react.dev/learn/conditional-rendering

- claim/API: `if`, ternaries, and `&&` are all valid ways to conditionally include JSX; returning `null` renders nothing.
- footgun: `count && <Badge />` renders a literal `0` on the page when `count` is `0`, because `0` is falsy but is still a value JSX will render. Use `count > 0 && <Badge />` or a ternary instead.
- Q (unanswered):

### Rendering Lists — https://react.dev/learn/rendering-lists

- claim/API: `.map()` turns an array of data into an array of elements; every element in a list needs a stable `key` prop that is not passed down as a regular prop.
- footgun: using the array index as `key` breaks item identity across sorts, inserts, and deletes — React matches old and new trees by key, so an index key causes the wrong row's state/DOM to follow the wrong data after a reorder. Use a stable field from the data (e.g. `incident.id`).
- Q (unanswered):

### Keeping Components Pure — https://react.dev/learn/keeping-components-pure

- claim/API: a component should be pure — same props/state/context in, same JSX out — and must not mutate any object or variable that existed before it was called. Strict Mode double-invokes components in development specifically to surface impurities.
- footgun: mutating an array or object that came in as a prop (e.g. calling `.push()` on it during render) can _appear_ to work once, then breaks unpredictably under Strict Mode or when React re-renders more than expected.
- Q (unanswered):

### Your UI as a Tree — https://react.dev/learn/understanding-your-ui-as-a-tree

- claim/API: a render tree models parent/child relationships between components at runtime (root/top-level vs. leaf components); a separate module dependency tree models which files import which, and is what bundlers use to build the shipped bundle.
- footgun: conflating the render tree (runtime, "what's on screen") with the module tree (build-time, "what's imported") leads to wrong intuitions when reasoning about re-render scope vs. bundle size.
- Q (unanswered):

### Render and Commit — https://react.dev/learn/render-and-commit

- claim/API: three steps put something on screen — **trigger** (initial render, or a state update on the component or an ancestor), **render** (React calls your components to figure out what should be on screen; this step does not touch the DOM), **commit** (React actually changes the DOM — every node on first mount, only the differences on updates).
- footgun: it's easy to assume "render" means the screen visibly changes. It doesn't — DOM mutation only happens in commit, and React is free to throw away in-progress render work without ever committing it (e.g. an interrupted render).
- Q (unanswered):

### State as a Snapshot — https://react.dev/learn/state-as-a-snapshot

- claim/API: a state variable read inside an event handler always holds the value from the render in which that handler was created — not "whatever it is right now." Calling the setter schedules a new render with a new snapshot; it does not mutate the existing variable in place.
- footgun: calling `setCount(count + 1)` three times in one handler queues three renders that all read the same stale `count` from that render's snapshot, netting +1 instead of +3. The updater form, `setCount(c => c + 1)`, reads the pending value instead and gives +3. (This is the exact trap Day 4 builds a test around.)
- Q (unanswered):

---

## Escalate — react.dev/blog, React 19.0 → 19.2 (render-path relevant notes)

- React 19 shipped Dec 5, 2024 (Actions, `use`, `ref` as prop, stable Server Components); 19.1 shipped ~June 2025; 19.2 shipped Oct 1, 2025 — three releases in a year, no breaking changes between them, but 19.2 ships stricter ESLint rules for `useEffectEvent`.
- 19.2 stabilized `<Activity>` (keeps a subtree mounted-but-hidden, preserving state while pausing its effects and deferring its updates) and `useEffectEvent` (stable-identity callback for reading latest props/state inside an effect without adding it to the dependency array). Both were experimental before 19.2.
- Relevant to render/commit specifically: `<Activity mode="hidden">` changes what "commit" does for a hidden subtree — it doesn't unmount, so state and the DOM subtree survive, but effects for that subtree are torn down and its updates are deprioritized. Filed away for Day 18; not needed yet.
- Check `github.com/facebook/react/blob/main/CHANGELOG.md` for the exact 19.0.0 → 19.2.x entries and cross-reference against the security notice (§3 of the plan) before treating any 19.0–19.2 patch below 19.0.3/19.1.4/19.2.3 as safe to run.
- Q (unanswered):

---

## Gate — GQ:5 (answer cold, no peeking, at the end of Day 3)

1. What are the three steps React goes through to get something on screen, and what happens in each one?
2. Name the two things that can trigger a render.
3. What does it mean for a component to be "pure," and what's the observable symptom when one isn't?
4. Why does React need a `key` on list items, and what specifically breaks when the array index is used as the key on a list that gets sorted or filtered?
5. Is the DOM touched during "render," or only during "commit"? What would you say to a teammate who claims "render updates the screen"?
