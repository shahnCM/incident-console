# TanStack Query — reading notes

_Goes at `notes/tanstack-query.md`_

# TanStack Query v5 — Crash Course

> **Version covered:** `@tanstack/react-query@5.x`, current as of July 2026.
> **Assumes:** you're comfortable with React components, hooks (`useState`/`useEffect`), and JS `async`/`await`.
> **Pairs well with:** the companion **React Router crash course** (routing/navigation) — see the "Pairing with React Router" section below for how the two combine.

---

## Contents

1. [Why TanStack Query](#1-why-tanstack-query)
2. [Installation & Setup](#2-installation--setup)
3. [useQuery Basics](#3-usequery-basics)
4. [Query Keys](#4-query-keys)
5. [Dependent Queries](#5-dependent-queries)
6. [Mutations](#6-mutations)
7. [Optimistic Updates](#7-optimistic-updates)
8. [Pagination & Infinite Queries](#8-pagination--infinite-queries)
9. [Caching: staleTime, gcTime & Defaults](#9-caching-staletime-gctime--defaults)
10. [queryOptions & Prefetching](#10-queryoptions--prefetching)
11. [DevTools](#11-devtools)
12. [Cheat Sheet](#12-cheat-sheet)
13. [Bonus: Pairing with React Router](#13-bonus-pairing-with-react-router)

---

## 1. Why TanStack Query

TanStack Query (formerly "React Query") manages **server state**: data that lives on a server, is fetched asynchronously, is shared across your app, and can go stale behind your back. It replaces the usual `useEffect` + `useState` + manual loading/error flags with a cache that handles fetching, deduping, background refetching, and retries for you.

## 2. Installation & Setup

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## 3. useQuery Basics

```tsx
import { useQuery } from '@tanstack/react-query'

function Todos() {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos, // must return a promise, or throw/reject on failure
  })

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Error: {error.message}</p>

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
      {isFetching && <span> (refreshing…)</span>}
    </ul>
  )
}
```

**The status flags, decoded:**

- `isPending` — true when there's no data yet (first load for this key, or the key just changed).
- `isFetching` — true whenever a request is in flight, _including_ silent background refetches.
- `isLoading` — `isPending && isFetching` combined; true only for that very first fetch.
- `status` — `"pending" | "error" | "success"`, if you prefer a single field to switch on.

## 4. Query Keys

Keys are arrays and act as the cache's address book. Include **every value your `queryFn` depends on**:

```tsx
useQuery({
  queryKey: ['todos', { status: 'done' }],
  queryFn: () => fetchTodos({ status: 'done' }),
})

useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId),
})
```

Rule of thumb: if a variable is used _inside_ `queryFn`, it belongs in `queryKey` — otherwise different calls will incorrectly share one cache entry.

## 5. Dependent Queries

Use `enabled` to wait on a value from another query:

```tsx
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: () => fetchUser(email),
})

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => fetchProjects(user.id),
  enabled: !!user?.id, // won't run until user.id exists
})
```

## 6. Mutations

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newTodo: { title: string }) => postTodo(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] }) // triggers a refetch
    },
  })

  return (
    <button disabled={mutation.isPending} onClick={() => mutation.mutate({ title: 'Learn Query' })}>
      {mutation.isPending ? 'Adding...' : 'Add Todo'}
    </button>
  )
}
```

`mutate()` is fire-and-forget; `mutateAsync()` returns a promise if you need to `await` it (e.g. before navigating away).

## 7. Optimistic Updates

Update the UI immediately, then roll back if the server disagrees:

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData(['todos'])
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map((t) => (t.id === newTodo.id ? newTodo : t)),
    )
    return { previous } // becomes `context` in onError
  },
  onError: (_err, _newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previous) // rollback
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] }) // reconcile with server truth
  },
})
```

## 8. Pagination & Infinite Queries

**Page-by-page** (keeps old data on screen while the next page loads — no flash of empty state):

```tsx
import { useQuery, keepPreviousData } from '@tanstack/react-query'

const { data, isPlaceholderData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
})
```

**Infinite scroll:**

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
})

// data.pages is an array — one entry per page fetched so far
```

## 9. Caching: staleTime, gcTime & Defaults

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 60_000, // "fresh" for 60s — served from cache with zero network calls
  gcTime: 5 * 60_000, // unused cache entries are garbage-collected after 5 min (was "cacheTime" pre-v5)
})
```

- **`staleTime`** (default `0`): how long data counts as fresh. Fresh data never triggers a refetch on mount/focus.
- **`gcTime`** (default 5 min): how long _inactive_ data is kept around before deletion, in case you navigate back to it.
- **Good to know:** by default, queries also refetch on **window refocus** and **reconnect**, and failed requests **retry 3 times** with backoff. All configurable per-query or globally via `QueryClient({ defaultOptions: { queries: {...} } })`.

## 10. queryOptions & Prefetching

`queryOptions` lets you define a query once and reuse it anywhere — components, prefetching, even router loaders:

```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

function todoOptions(id: number) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
  })
}

useQuery(todoOptions(5))
await queryClient.prefetchQuery(todoOptions(5)) // warm the cache ahead of time
```

Prefetching is commonly triggered on link hover, or from a router loader (see section 13 below).

## 11. DevTools

Drop `<ReactQueryDevtools />` anywhere inside `QueryClientProvider`. It gives you a floating panel showing every query and mutation, their status, and their cached data — genuinely one of the fastest ways to debug "why is this stale" bugs.

## 12. Cheat Sheet

| Need                              | API                                           |
| --------------------------------- | --------------------------------------------- |
| Provide the client                | `QueryClient` + `QueryClientProvider`         |
| Fetch data                        | `useQuery({ queryKey, queryFn })`             |
| No data yet                       | `isPending`                                   |
| Any request in flight             | `isFetching`                                  |
| Skip a query conditionally        | `enabled: boolean`                            |
| Write data                        | `useMutation({ mutationFn })`                 |
| Refetch after a mutation          | `queryClient.invalidateQueries({ queryKey })` |
| Read/write cache directly         | `getQueryData()` / `setQueryData()`           |
| Keep old data while paginating    | `placeholderData: keepPreviousData`           |
| Infinite scroll                   | `useInfiniteQuery`                            |
| Fresh vs. cached-but-old          | `staleTime`                                   |
| How long unused data survives     | `gcTime`                                      |
| Warm the cache early              | `queryClient.prefetchQuery()`                 |
| Reusable, typed query definitions | `queryOptions()`                              |

---

## 13. Bonus: Pairing with React Router

A common production pattern: let a React Router **loader** kick off `queryClient.ensureQueryData()`, then read the result in the component with the _same_ `useQuery` hook. You get the router's fetch-before-render timing (no request waterfalls) plus Query's cache, background refetching, and mutation invalidation — both tools doing what they're best at.

```tsx
const queryClient = new QueryClient()

// In a React Router Data or Framework mode loader:
export async function loader({ params }) {
  const options = todoOptions(params.todoId)
  await queryClient.ensureQueryData(options) // uses cache if fresh, else fetches
  return null // the component reads via useQuery, not useLoaderData
}

function TodoPage({ params }) {
  const { data: todo } = useQuery(todoOptions(params.todoId)) // instant — already warmed by the loader
  return <h1>{todo.title}</h1>
}
```

Why bother with both? The loader starts the fetch the instant navigation begins (in parallel with any lazy-loaded code), while `useQuery` in the component keeps handling cache invalidation, refetch-on-focus, and optimistic updates exactly like it would anywhere else. The loader just removes the fetch waterfall — Query still owns the data's entire lifecycle.

> For routing fundamentals (loaders, actions, the three modes), see the companion **React Router crash course**.

---

## Further Reading

- Official docs: [tanstack.com/query](https://tanstack.com/query)
- Next to explore once this feels comfortable: the `select` option (transform cached data without refetching) and `useQueries` (dynamic lists of parallel queries)
