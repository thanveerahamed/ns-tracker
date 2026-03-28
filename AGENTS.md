# AGENTS.md

## Project Overview

NS Tracker is a React 19 PWA for Dutch train (NS) trip planning. It wraps the [NS public API](https://apiportal.ns.nl/) with Firebase Auth (Google sign-in) and Firestore for user data (favourites, recent searches, split-view comparisons).

## Tech Stack & Tooling

- **Runtime**: React 19 + TypeScript 5.9, Vite 8, Tailwind CSS 4 (v4 `@theme` syntax in `src/index.css`)
- **Package manager**: pnpm (`pnpm install`, **not** npm/yarn)
- **UI**: shadcn/ui (`components.json`, new-york style) → primitives live in `src/components/ui/`
- **Data fetching**: TanStack Query v5 — all server state goes through custom hooks in `src/apis/`
- **HTTP client**: `ky` via `src/clients/nsClient.ts` (single `apiGet<T>` wrapper, auto-injects NS API key)
- **Forms**: react-hook-form + zod v4 (`zod/v4` import path — not default zod)
- **Date handling**: `dayjs` everywhere (not `date-fns`, despite it being installed)
- **Routing**: react-router-dom v7, lazy-loaded heavy pages (`ResultsPage`, `SplitViewPage`, `TripDetailPage`)
- **Hosting**: Firebase Hosting (`firebase.json` → `dist/`)

## Key Commands

```bash
pnpm dev          # Dev server on port 4001
pnpm build        # tsc + vite build
pnpm lint:check   # ESLint (flat config)
pnpm lint:fix
pnpm format:check # Prettier (with tailwindcss plugin)
pnpm format:fix
pnpm type:check   # tsc --noEmit
```

No test framework is configured.

## Architecture & Data Flow

```
src/
├── clients/nsClient.ts    # Single ky instance, all NS API calls go through apiGet<T>
├── services/              # Data-access layer: NS API calls + Firestore CRUD
├── apis/                  # TanStack Query hooks wrapping services (useTripsInformation, useStationsQuery, etc.)
├── pages/                 # Route-level components, consume hooks from apis/
├── components/            # Presentational components grouped by feature (search/, results/, layout/, ui/)
├── contexts/              # AuthContext (Firebase Google auth), ThemeContext (light/dark via class toggle)
├── types/                 # TypeScript interfaces mirroring NS API response shapes
└── utils/                 # Pure helpers (date formatting, station display names, NES color mapping)
```

**Adding a new NS API endpoint**: create the service function in `services/` calling `apiGet<T>`, then wrap it in a TanStack Query hook in `apis/`, then consume the hook in a page/component.

## Critical Patterns

### Import Aliases

All internal imports use `@/*` → `src/*` (configured in `tsconfig.app.json` and `vite.config.ts`). Always use `@/` imports, never relative `../` from outside the same directory.

### NS API Client

`src/clients/nsClient.ts` reads `VITE_NS_OCP_API_ENDPOINT` and `VITE_NS_OCP_APIM_KEY` from env. Every API call gets `lang: 'en'` injected automatically. Paths should **not** have a leading slash when passed to `apiGet`.

### Firestore Structure

All user data lives under `users/{userId}/`:

- `favouriteStations/{UICCode}` — station document
- `favouriteTrips/{autoId}` — trip JSON stored as string (`JSON.stringify`)
- `recentSearch/{originUIC + destUIC + viaUIC}` — deduped by compound key
- `splitViews/{autoId}` — split-view comparison configs

### Search State Persistence

Search form state (origin, destination, via, dateTime, toggles) is cached in `localStorage` via `src/services/cache.ts`. The `LocationType` const enum (`'origin' | 'destination' | 'via'`) keys the station cache entries.

### Route Parameters

Results are passed via URL search params, not React state:

```
/results?origin={UICCode}&originName={name}&destination={UICCode}&destinationName={name}&dateTime={ISO}&isArrival={bool}
```

Optional: `via`, `viaName`. Trip detail uses `ctxRecon` (NS reconstruction context token).

### Zod v4

This project uses `zod/v4` (not the default `zod` import). When adding schemas:

```ts
import { z } from 'zod/v4'
```

### Environment Variables

All prefixed with `VITE_`:

- `VITE_NS_OCP_API_ENDPOINT`, `VITE_NS_OCP_APIM_KEY` — NS API
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_MESSAGE_SENDER_ID`, `VITE_FIREBASE_APP_ID` — Firebase

### Component Conventions

- Icons: `lucide-react` exclusively
- Animations: `framer-motion` for page transitions and micro-interactions
- Toasts: `sonner` via `toast()` — Toaster mounted in `main.tsx`
- UI primitives: use existing shadcn components from `src/components/ui/`; add new ones via `npx shadcn@latest add <component>`
