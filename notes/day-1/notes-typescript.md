# TypeScript Handbook — reading notes

_Goes at `notes/typescript.md`_

## The Basics — https://www.typescriptlang.org/docs/handbook/2/basic-types.html — 2026-07-26

- claim / API: type annotations are fully erased at compile time and never affect runtime
  behavior — `tsc` will still emit JS even with type errors present unless `noEmitOnError` is set.
  Strictness is explicitly framed as a dial, not a switch: `strict: true` toggles a bundle of
  individually-controllable flags, and the handbook singles out `noImplicitAny` and
  `strictNullChecks` as the two that matter most.
- footgun: with `strict` off, `null`/`undefined` are assignable to any type with no warning — the
  handbook calls this out directly (their words: a "billion dollar mistake") and says new
  codebases should turn strictness on from day one, not bolt it on later.
- Q (unanswered): our tsconfig goes past plain `strict` — `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride` aren't mentioned on this introductory page at
  all. Confirm each is documented individually in the TSConfig reference, not just inferred as
  "strict mode, but stricter."

## Everyday Types — https://www.typescriptlang.org/docs/handbook/2/everyday-types.html — 2026-07-26

- claim / API: `any` disables type-checking entirely for that value and everything derived from
  it — the handbook's own framing is that it's "the plain JavaScript experience," not a mild
  version of typing. Literal types (`"left" | "right" | "center"`) plus union narrowing (`typeof`,
  `Array.isArray`, etc.) is the standard way to model a small fixed set of valid values.
- footgun: object literal properties get _widened_ on assignment — a field initialized as `"GET"`
  infers as `string`, not the literal `"GET"`, unless pinned with `as const` or an explicit literal
  annotation. Exactly the shape of bug a hand-written or inferred union type could hit later.
- Q (unanswered): the page flags enums as "not a type-level addition to JavaScript... hold off
  unless you're sure" — our tsconfig's `erasableSyntaxOnly` forbids them outright. Is that flag
  _why_ the plan leans on literal unions everywhere, or coincidental?
