# React — Gate (GQ:5, Day 3)

1. What are the three steps React goes through to get something on screen, and what happens in each one?

**Trigger** — something schedules a render: either the initial render (the first call to `root.render()`) or a state update on a component or one of its ancestors. **Render** — React calls your component functions to work out what the JSX describes; this is pure calculation and does not touch the DOM at all — React can even throw the result away without ever using it. **Commit** — React applies the difference between the old and new result to the real DOM: every node on first mount, only the specific changed nodes/attributes on an update.

2. Name the two things that can trigger a render.

The component's initial mount (the first `root.render()` call), and a state update — calling a state setter on the component itself or on any of its ancestors.

3. What does it mean for a component to be "pure," and what's the observable symptom when one isn't?

Same props/state/context in, same JSX out, every time — and no mutating any object or variable that already existed before the component was called. An impure component shows up as inconsistent output between renders, or as a bug that only appears under Strict Mode (which intentionally double-invokes components in development to surface exactly this) — e.g. a value that increments by two instead of one because the render itself mutated something shared, or list content that shuffles unpredictably between renders with no state change to explain it.

4. Why does React need a `key` on list items, and what specifically breaks when the array index is used as the key on a list that gets sorted or filtered?

Keys let React match items between the previous render's list and the next one, so it knows "this is the same item, possibly moved" rather than "this is a new item" — that's how it preserves DOM node identity, focus, and per-item state correctly, and does minimal reordering instead of rebuilding everything. With index-as-key, the key stays pinned to a _position_, not to the underlying data. After a sort, filter, insert, or delete, position 0 still has key `"0"` but now points at different data — so React assumes the state/DOM at that position belongs with the new item, and you get stale state or input values following the wrong row.

5. Is the DOM touched during "render," or only during "commit"? What would you say to a teammate who claims "render updates the screen"?

Only during commit. I'd tell them render is React figuring out _what should_ be on screen by calling your functions — nothing visible changes yet, and that work can even be discarded unused. The actual DOM mutation, and the only point the screen visibly changes, happens in the separate commit step.
