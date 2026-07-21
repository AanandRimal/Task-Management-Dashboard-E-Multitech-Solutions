# Architecture Guide (Beginner-Friendly)

This document explains **how the project is organized** and **why**, so a junior developer can navigate the codebase without guessing.

---

## The big picture

```
Browser
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  app/          Routes (URLs) — thin, mostly imports     │
├─────────────────────────────────────────────────────────┤
│  features/     Business logic grouped by feature        │
├─────────────────────────────────────────────────────────┤
│  components/   Shared UI (not tied to one feature)        │
├─────────────────────────────────────────────────────────┤
│  store/        Redux setup (global state config)          │
├─────────────────────────────────────────────────────────┤
│  lib/          Utilities + mock API repository          │
└─────────────────────────────────────────────────────────┘
   │
   ▼
/api/tasks  ← Next.js Route Handlers (mock REST API)
```

**Rule of thumb:** Pages in `app/` should be short. Real UI and logic live in `features/`.

---

## Folder-by-folder

### `src/app/` — Routing only

Next.js App Router maps folders to URLs.

| Path | URL | What it does |
|------|-----|--------------|
| `(auth)/login/page.tsx` | `/login` | Login screen (public) |
| `(app)/page.tsx` | `/` | Dashboard overview (protected) |
| `(app)/tasks/page.tsx` | `/tasks` | Task list (protected) |
| `(app)/tasks/[id]/page.tsx` | `/tasks/abc123` | Task detail (protected) |
| `api/tasks/route.ts` | `GET/POST /api/tasks` | Mock API |
| `api/tasks/[id]/route.ts` | `GET/PATCH/DELETE /api/tasks/:id` | Mock API |

**Route groups** `(auth)` and `(app)` organize layouts without affecting the URL. `(app)/layout.tsx` wraps authenticated pages with the sidebar shell.

### `src/features/` — One folder per feature

Each feature owns its components, Redux slices, API endpoints, and Zod schemas.

#### `features/auth/`

| File | Role |
|------|------|
| `auth.slice.ts` | Stores `{ user, token, status }` — **persisted** |
| `auth.schema.ts` | Zod validation for login form |
| `components/login-form.tsx` | Email/password form (React Hook Form) |
| `use-auth.ts` | Hook: `login()`, `logout()`, selectors |

#### `features/tasks/`

| File | Role |
|------|------|
| `task.schema.ts` | **Single source of truth** for Task type (Zod) |
| `tasks.api.ts` | RTK Query endpoints (fetch, create, update, delete) |
| `filters.slice.ts` | Search, status, priority, sort — **persisted** |
| `selected-task.slice.ts` | Which task is selected — **not persisted** |
| `task.utils.ts` | Pure functions: filter, sort, paginate |
| `use-task-filters.ts` | Syncs filters ↔ URL query params |
| `components/*` | TaskCard, TaskTable, TaskForm, TaskFilters, etc. |

#### `features/dashboard/`

| File | Role |
|------|------|
| `dashboard.selectors.ts` | Memoized stats from RTK Query cache |
| `components/stat-card.tsx` | Reusable metric card |
| `components/completion-ring.tsx` | SVG ring on Completed card |

### `src/store/` — Redux configuration

| File | Role |
|------|------|
| `index.ts` | `configureStore`, middleware, persistor |
| `root-reducer.ts` | Combines all reducers |
| `base-api.ts` | **One** RTK Query `createApi()` — endpoints injected elsewhere |
| `persist-config.ts` | Whitelist: `auth`, `filters`, `preferences` only |
| `ui.slice.ts` | Sidebar open, active modal — **not persisted** |
| `preferences.slice.ts` | User prefs (density, default sort) — **persisted** |
| `hooks.ts` | Typed `useAppDispatch` / `useAppSelector` |

### `src/components/common/` — Cross-feature UI

These are **not** low-level buttons — those live in `components/ui/` (shadcn).

| Component | Used for |
|-----------|----------|
| `data-state.tsx` | Loading skeleton / error + retry / empty / children |
| `confirm-dialog.tsx` | Delete confirmation |
| `empty-state.tsx` | Friendly empty list message |
| `page-header.tsx` | Consistent page title + actions |
| `app-shell.tsx` | Sidebar, header, auth redirect |
| `theme-toggle.tsx` | Light / dark / system |

### `src/lib/`

| File | Role |
|------|------|
| `api/repository.ts` | In-memory `Map` of tasks — used by Route Handlers |
| `api/seed.ts` | 15 realistic seed tasks |
| `utils.ts` | `cn()`, `debounce()`, date formatting |
| `motion.ts` | Shared Framer Motion variants |
| `persist-storage.ts` | SSR-safe storage (noop on server) |

---

## Data flow (read this first when debugging)

### 1. Loading tasks

```
TaskTable / DashboardView
        │
        ▼
useGetTasksQuery()          ← RTK Query hook (features/tasks/tasks.api.ts)
        │
        ▼
fetch('/api/tasks')         ← base-api.ts baseQuery
        │
        ▼
app/api/tasks/route.ts      ← Route Handler
        │
        ▼
lib/api/repository.ts       ← in-memory store
```

Tasks are **never copied into a Redux slice**. RTK Query cache is the source of truth.

### 2. Creating a task

```
TaskForm (RHF + Zod)
        │
        ▼
useCreateTaskMutation()
        │
        ▼
POST /api/tasks
        │
        ▼
invalidatesTags: ['Task', 'LIST']  → refetches list automatically
```

### 3. Filters

```
User types in search
        │
        ▼
debounce 300ms → filters.slice (Redux)
        │
        ├──► Redux Persist (survives refresh)
        └──► URL ?q=...&status=... (shareable link)
        │
        ▼
applyFilters(tasks, filters)   ← pure function, client-side
```

### 4. Authentication

```
LoginForm submit
        │
        ▼
auth.slice.login({ email, token })
        │
        ▼
Redux Persist → localStorage
        │
        ▼
AppShell checks selectIsAuthenticated → redirect if missing
```

---

## State: what goes where?

| Data | Storage | Persisted? | Why |
|------|---------|------------|-----|
| Tasks from API | RTK Query cache | **No** | Fresh data on load; avoid stale cache |
| Auth session | `auth` slice | **Yes** | Stay logged in across refresh |
| Filter prefs | `filters` slice | **Yes** | Restore last search/filters |
| UI prefs | `preferences` slice | **Yes** | User settings |
| Sidebar/modal | `ui` slice | **No** | Transient — shouldn't reopen after refresh |
| Selected task ID | `selectedTask` slice | **No** | Transient |
| Theme | next-themes | **Yes** (localStorage) | Not Redux — avoids double persistence |

---

## Key patterns to recognize

### Single RTK Query API with injection

```ts
// store/base-api.ts — empty endpoints
export const baseApi = createApi({ ... endpoints: () => ({}) });

// features/tasks/tasks.api.ts — add task endpoints
export const tasksApi = baseApi.injectEndpoints({ ... });
```

One middleware, one reducer path, but endpoints stay next to the feature.

### Zod → TypeScript type

```ts
export const TaskSchema = z.object({ ... });
export type Task = z.infer<typeof TaskSchema>;
```

Use the **same schema** in forms and API validation.

### Optimistic updates

When editing/deleting, the UI updates immediately; if the API fails, RTK Query **undoes** the change. See `onQueryStarted` in `tasks.api.ts`.

### DataState wrapper

Every list/detail view wraps content like this:

```tsx
<DataState
  isLoading={...}
  isError={...}
  isEmpty={...}
  onRetry={() => refetch()}
>
  {/* actual content */}
</DataState>
```

One component handles all async UI states consistently.

---

## Where to start reading code

1. **`src/app/providers.tsx`** — how Redux + theme wrap the app
2. **`src/features/tasks/task.schema.ts`** — data shape
3. **`src/features/tasks/tasks.api.ts`** — all task API calls
4. **`src/features/tasks/components/tasks-view.tsx`** — main task list page
5. **`src/components/common/data-state.tsx`** — loading/error/empty pattern

---

## Adding a new feature (checklist)

1. Create `src/features/my-feature/`
2. Add components, slice (if client state), schema (if forms)
3. If it needs API data: `baseApi.injectEndpoints()` in `my-feature.api.ts`
4. Add a thin page in `src/app/(app)/my-feature/page.tsx`
5. Add nav link in `app-shell.tsx` if needed
6. Update persist whitelist **only** if state should survive refresh

---

## Tests

| File | Tests |
|------|-------|
| `features/tasks/task.utils.test.ts` | Filter, sort, paginate logic |
| `features/auth/auth.slice.test.ts` | Login/logout reducer |
| `e2e/happy-path.spec.ts` | Login → create task → see in list |

Run: `npm run test` and `npm run test:e2e`

---

## Common questions

**Q: Why no `services/` folder?**  
A: RTK Query *is* the service layer. A folder that re-exports hooks adds indirection without value.

**Q: Why feature-first instead of `components/` + `hooks/` + `types/`?**  
A: Code that changes together stays together. When you edit tasks, everything is under `features/tasks/`.

**Q: Can I add server-side filtering?**  
A: Yes. `GET /api/tasks` already accepts `?status=&priority=&search=`. Switch `applyFilters` to pass query params instead of filtering client-side.

**Q: Where is the design system?**  
A: CSS variables in `src/app/globals.css` (iris accent, priority colors). shadcn components read these tokens.
