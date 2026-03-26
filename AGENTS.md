# AGENTS.md

## Project Snapshot
- `ns-tracker` is a mobile-first React + TypeScript SPA for NS train planning/tracking.
- Stack: Vite, React Router, MUI, TanStack Query, Firebase Auth/Firestore, Google Maps, dayjs.
- Build output is `build/` (see `vite.config.ts`) and Firebase Hosting serves that folder (`firebase.json`).

## Architecture You Need First
- App bootstrap and provider order live in `src/main.tsx`: `QueryClientProvider` -> `LocalizationProvider` (dayjs/nl) -> `ThemeProvider` -> app contexts -> router.
- Route tree is centralized in `src/routes.tsx`; authenticated shell is `src/pages/App.tsx` and redirects unauthenticated users to `/login`.
- Main data flow: UI (`src/components/SearchFilter.tsx`) -> filter state (`src/context/SearchFilterContext.tsx`) -> trip state (`src/context/TripsInformationContext.tsx`) -> query hook (`src/hooks/useTrips.ts`) -> API hooks (`src/apis/trips.ts`) -> services (`src/services/trip.ts`) -> HTTP client (`src/clients/nsClient.ts`).
- Split-view is a parallel feature slice under `src/pages/splitView/*` and `src/services/splitView.ts`, persisted per-user in Firestore.

## External Integrations and Boundaries
- NS API calls go through `apiGet` in `src/clients/nsClient.ts`; it injects `lang=en` and `Ocp-Apim-Subscription-Key` from env.
- Firebase is initialized in `src/services/firebase.ts`; auth + Firestore drive login, favorites, recents, and split views.
- Firestore structure is user-scoped (`users/{uid}/favouriteTrips`, `favouriteStations`, `recentSearch`, `splitViews`).
- Google Maps is only mounted in journey details (`src/components/JourneyInformation.tsx`) via `@vis.gl/react-google-maps` + deck.gl overlay (`src/components/DeckLayer.tsx`).

## Commands and Local Workflow
- Install deps: `npm install`
- Dev server: `npm run dev` (configured to open `/index.html` on port `5174`).
- Production build: `npm run build` (runs `tsc` then `vite build`).
- Static preview: `npm run preview`
- Quality checks used in this repo:
  - `npm run lint:check`
  - `npm run type:check`
  - `npm run format:check`
- There is currently no `test` script in `package.json`; rely on lint/type/build for validation.

## Project-Specific Conventions
- Internal imports usually include explicit `.ts`/`.tsx` suffixes (follow existing style when editing).
- Context access should use guard hooks from `src/context/index.ts` (they throw if provider wiring is wrong).
- Query keys are explicit and structured (example: `['trips', 'trip', ctxRecon]` in `src/apis/trips.ts`); keep key shape stable.
- Date handling is dayjs-based, with global plugin setup in `src/utils/date.ts` imported once from `src/main.tsx`.
- Search UI state is persisted to `localStorage` via `src/services/cache.ts` (key prefix: `search.*`).
- Formatting/import order is enforced by Prettier + `@trivago/prettier-plugin-sort-imports` (`.prettierrc`).

## Safe Change Patterns
- When adding data-fetching features, prefer `src/apis/*` hooks + `src/services/*` functions rather than calling Axios directly from components.
- When adding authenticated data, keep it under `users/{uid}/...` collections to match existing security/data model.
- If you add new env usage, keep access through `import.meta.env` in service/client boundaries (not deep UI components unless integration-specific like maps).

