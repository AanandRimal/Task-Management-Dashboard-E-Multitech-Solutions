# Task Management Dashboard

A production-style task dashboard built for a frontend take-home assignment. It demonstrates feature-first architecture, Redux Toolkit + RTK Query, Redux Persist, responsive UI, and polished loading/error/empty states.

**Live demo:** run locally with `npm run dev` → [https://task-management-dashboard-e-multite.vercel.app/](https://task-management-dashboard-e-multite.vercel.app/)

---

## Installation

**Requirements:** Node.js 20+, npm 10+

```bash
git clone <your-repo-url>
cd task-management-dashboard
npm install
npm run dev
```

Open [https://task-management-dashboard-e-multite.vercel.app/](https://task-management-dashboard-e-multite.vercel.app/). Mock auth accepts any valid email and a password with 6+ characters.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright happy-path test |

---

## Environment Variables

No environment variables are required. The app uses Next.js Route Handlers at `/api/tasks` with an in-memory store.

Optional:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Dev server port |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router — routing only (thin pages)
│   ├── (auth)/login/       # Public login route
│   ├── (app)/              # Authenticated shell (sidebar + guard)
│   │   ├── page.tsx        # Dashboard overview
│   │   └── tasks/          # Task list + detail routes
│   ├── api/tasks/          # Mock REST API (Route Handlers)
│   ├── layout.tsx          # Root HTML, fonts, Providers
│   └── providers.tsx       # Redux, PersistGate, ThemeProvider
│
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Dialog, Table…)
│   └── common/             # Shared composites used across features
│       ├── app-shell.tsx   # Sidebar, header, auth guard
│       ├── data-state.tsx  # Loading / error / empty wrapper
│       ├── confirm-dialog.tsx
│       └── theme-toggle.tsx
│
├── features/               # Feature modules — colocated by domain
│   ├── auth/               # Login form, auth slice, Zod schema
│   ├── dashboard/          # Summary cards, memoized selectors
│   └── tasks/              # CRUD UI, RTK Query endpoints, filters
│
├── store/                  # Redux store configuration
│   ├── base-api.ts         # Single RTK Query API slice
│   ├── root-reducer.ts     # combineReducers
│   ├── persist-config.ts   # Whitelist: auth, filters, preferences
│   └── ui.slice.ts         # Transient UI (sidebar, modals)
│
├── lib/
│   ├── api/repository.ts   # In-memory task store for Route Handlers
│   ├── api/seed.ts         # Realistic seed data
│   ├── motion.ts           # Framer Motion tokens
│   └── utils.ts            # cn(), debounce, date helpers
│
└── constants/              # Route paths, enum labels
```

For a guided walkthrough, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## Libraries Used

| Library | Purpose |
|---------|---------|
| **Next.js 16** (App Router) | Routing, SSR, API Route Handlers |
| **TypeScript** (strict) | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible UI primitives |
| **Redux Toolkit** | Client state slices |
| **RTK Query** | Server state, caching, mutations |
| **Redux Persist** | Persist auth, filters, preferences |
| **next-themes** | Light / dark / system theme |
| **Framer Motion** | List, card, and dialog animations |
| **React Hook Form + Zod** | Form validation (single schema source) |
| **Vitest + Testing Library** | Unit tests |
| **Playwright** | E2E happy path |
| **ESLint + Prettier** | Linting and formatting |

---

## Features Implemented

### Core (assignment requirements)

- **Mock auth** — login/logout, persisted in Redux
- **Dashboard** — Total, Completed, Pending, High priority summary cards
- **Task CRUD** — list, detail, create, edit, delete
- **Search & filters** — title search, status/priority filters, due-date sort
- **Theme** — light/dark/system via next-themes (persisted in localStorage)
- **State** — RTK Query for tasks; slices for auth, UI, filters, preferences
- **Animations** — staggered dashboard cards, list enter/exit, dialog transitions
- **Responsive** — table on desktop, cards on mobile
- **Loading/error/empty** — reusable `DataState` component everywhere

### Bonus features

- Debounced search (~300ms)
- URL-synced filters (shareable links, refresh-safe)
- Optimistic updates on edit and delete
- Pagination (8 items per page)
- Keyboard shortcuts: `c` = create task, `/` = focus search
- Accessibility: focus management, ARIA labels, `prefers-reduced-motion`
- Unit tests (`task.utils`, `auth.slice`) + Playwright E2E

### Deliberately skipped

- **Drag-and-drop ordering** — no order field in the data model; would add complexity without clear product value for a 1-day scope
- **Infinite scroll** — pagination covers the demo dataset cleanly

---

## Assumptions

1. **Mock authentication** — any valid email + password (6+ chars) succeeds; no backend verification.
2. **Single user** — no multi-tenant or role-based access.
3. **Client-side filtering** — filters run over the RTK Query cache via `applyFilters()`. The API also accepts query params for future server-side filtering.
4. **Theme persistence** — handled by `next-themes` in localStorage, **not** Redux (one source of truth).
5. **Due dates** — stored as ISO strings; displayed in local timezone.
6. **Task detail** — dedicated route at `/tasks/[id]` (not a drawer) for clearer deep-linking.

---

## Known Limitations

1. **In-memory API** — task data resets on server restart or serverless cold start. Documented trade-off for zero extra processes.
2. **No real authentication** — tokens are mock strings; do not use in production.
3. **No offline support** — requires network for API calls (even though the API is local).
4. **Filter persistence vs URL** — Redux Persist restores filters on load; URL hydration runs once on mount. Direct URL edits after hydration require a refresh to sync Redux.
5. **Playwright E2E** — requires `npx playwright install` before first run.

---

## Architecture Decisions & Trade-offs

I chose a **feature-first folder structure** because it keeps related code together. If you delete `features/tasks/`, the app breaks in predictable places (task routes and API) rather than scattering broken imports across a global `components/` or `services/` folder.

**RTK Query owns all server state.** Tasks live in the RTK Query cache, not a Redux slice. Mixing fetched data into plain slices is a common anti-pattern — it duplicates source of truth and fights cache invalidation. Slices handle only client concerns: auth session, filter preferences, UI chrome, and selected-task ID.

**One `baseApi` with injected endpoints** scales better than separate API slices per feature. Each feature file (`tasks.api.ts`) calls `baseApi.injectEndpoints()`, so there is one middleware, one reducer, and shared tag invalidation — but endpoints stay colocated with the feature that uses them.

**Redux Persist whitelist is intentionally narrow:** `auth`, `filters`, `preferences`. The API cache is **never** persisted — stale task data after reload is worse than a fresh fetch, and persisting RTK Query state is explicitly discouraged. Transient slices (`ui`, `selectedTask`) are also excluded because reopening a sidebar or modal after refresh would feel broken.

**Theme lives in next-themes, not Redux.** Theme is a presentation preference with its own hydration story (`suppressHydrationWarning`, no flash). Putting it in Redux would mean two persistence mechanisms or custom middleware for no gain.

**Mock API via Next.js Route Handlers** keeps the repo self-contained — no JSON Server or MSW setup step for reviewers. The trade-off is the in-memory store resets on restart; the repository pattern in `lib/api/repository.ts` would swap cleanly to a real database later.

**Zod schemas are the single source of truth** for Task types. The same `CreateTaskSchema` validates API POST bodies and form submissions, so frontend and backend cannot drift silently.

---

## Evaluation Criteria Mapping

| Criterion (weight) | Where to look |
|--------------------|---------------|
| Code Quality (25%) | Strict TS, ESLint clean, small focused components |
| Architecture (20%) | `features/` layout, this README + ARCHITECTURE.md |
| RTK Query (15%) | `store/base-api.ts`, `features/tasks/tasks.api.ts` |
| State Persistence (10%) | `store/persist-config.ts`, SSR-safe storage |
| Responsive UX (10%) | `task-table.tsx` / `task-card.tsx`, `app-shell.tsx` |
| Reusability (10%) | `DataState`, `ConfirmDialog`, `TaskForm`, `StatCard` |
| Framer Motion (5%) | `lib/motion.ts`, dashboard + task list animations |
| TypeScript (5%) | `task.schema.ts`, inferred types, no `any` |

---

## License

MIT — take-home assignment submission.
