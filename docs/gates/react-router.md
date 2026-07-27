# Gate — G[N]: Routing & Data (React Router / TanStack Query)

_Goes at `docs/gates/routing-data.md`_

Four things I'd tell a new hire about how these two fit together on this project.

1. **They're two independent revalidation systems until you deliberately wire them together.**
   A router `loader` refetches and re-renders on navigation; a `useQuery` cache refetches on its
   own schedule (`staleTime`, refocus, invalidation). Nothing links the two automatically. The
   `queryOptions()` + `ensureQueryData()` pattern is how you point a loader at the same cache entry
   a component reads — skip that wiring and mixing a `<Form>` action with a sibling `useQuery` read
   will show stale data after a mutation, because the action revalidates loaders, not the Query
   cache.

2. **Arrow-function route components break typed `matches`.** Route Module `ComponentProps`
   ships a type-safe `matches` field, but it only resolves correctly on a named `function`
   component — an arrow-function export sends the type checker into infinite recursion. The
   maintainers know about this and have said they're not removing `matches` to fix it, so it's a
   permanent rule, not a temporary bug: write route components as
   `export default function Page(...)`, never `export default (...) => ...`.

3. **Router owns _if/when_ it renders; Query owns the data's entire life after that.** A `loader`
   should be a thin trigger — kick off `ensureQueryData` and get out of the way. Once Query holds
   the entry, it decides staleness, retries, background refetch, and optimistic rollback. If a
   `loader` starts holding transform logic or its own caching, that's a sign the two are fighting
   over a job only one of them should have.

4. **A `QueryClient` built inline in a component body silently resets on every render.** It has to
   be created once — module scope, or `useState(() => new QueryClient())` — never as
   `new QueryClient()` directly in the render body. Nothing throws when this is wrong; the cache
   just quietly stops persisting between renders and every query looks like a fresh mount.

**Bonus:** `isPending: false` only means _you have data_ — it says nothing about whether a request
is running right now. A background refetch after refocus or invalidation shows up in `isFetching`,
not `isPending`, so a new hire watching the wrong flag will read an active refetch as "idle."

---
