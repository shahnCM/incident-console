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
