# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # tsc type-check + Vite production build
npm run lint      # ESLint
npm run preview   # serve the dist/ build locally
```

No test suite is currently configured.

## Environment

Requires `.env.local` with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Supabase (auth + postgres + storage), Radix UI primitives. Path alias `@/` resolves to `src/`.

### Data layer (`src/lib/api.ts`)

All Supabase calls are centralized here — no component fetches directly. Every function has a demo-mode branch that returns data from `src/lib/mock-data.ts` instead of hitting the network. Demo mode is toggled via `setDemoMode(true)` in `App.tsx` when the user clicks "Try Demo".

The constant `ENTRY_SELECT = '*, venues(*), entry_tags(tags(*))'` drives the shape of all entry queries. Raw Supabase rows are normalized into the `Entry` type by `transformEntry`.

**Soft deletes:** entries are never deleted from the database — `deleteEntry` sets `is_deleted: true`. All queries filter `.eq('is_deleted', false)`.

**Tags** are many-to-many via the `entry_tags` join table. On update, all existing `entry_tags` rows for an entry are deleted and reinserted.

**Photos** are stored in Supabase Storage bucket `entry-photos` as `{userId}/{timestamp}.{ext}`. While the form is being filled out, new photos live as DataURLs in component state; `EntryForm` uploads them (DataURL → blob → storage) on submit before calling `createEntry`/`updateEntry`.

### Auth flow (`App.tsx`, `src/pages/Login.tsx`, `src/pages/AuthCallback.tsx`)

Auth state is owned by `App.tsx`, which subscribes to `supabase.auth.onAuthStateChange`. `AppLayout` (`src/components/layout/AppLayout.tsx`) redirects unauthenticated users to `/login`. The OAuth callback lands at `/auth/callback` → `AuthCallback` page.

### Layout

Mobile-first: `BottomNav` for narrow screens, a sidebar (`md:ml-56`) for wider screens. `FloatingActionButton` provides quick access to `/entry/new`. `AppLayout` wraps all protected routes via React Router's `<Outlet>`.

### Types (`src/types/app.ts`)

`Entry`, `Venue`, `Tag`, `Profile`, and `Stats` are the five core domain types shared across the whole app.
