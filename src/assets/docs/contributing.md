# Contributing

## Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** (for API work)
- **Firebase** project (for auth)

## Clone and install

```bash
git clone <repo-url>
cd gaeilge_app/gaeilge-app && npm install
cd ../gaeilge-app-api && npm install
```

## Environment

**Frontend** — create `gaeilge-app/.env` (see `gaeilge-app/README.md`):

- `VITE_API_BASE_URL`
- `VITE_FIREBASE_*` keys from Firebase console

**API** — copy `gaeilge-app-api/.env.example` to `.env` and fill database and Firebase admin values.

## Run locally

```bash
# Terminal 1 — API (port 3004)
cd gaeilge-app-api && npm run start

# Terminal 2 — Vue (port 5173)
cd gaeilge-app && npm run dev
```

## Conventions

- Follow `.cursor/rules/` in this repo (styling, components, stores, API, testing).
- Prefer **services + Pinia** over calling HTTP from components.
- Reusable UI/async patterns: `src/composables/` (e.g. `useAsyncAction`, `useGuestGuard`).
- Add **`data-testid`** on interactive UI you change.
- **TypeScript:** no new `any` without justification.

## Testing

```bash
cd gaeilge-app
npm run test:unit
npm run test:e2e:dev   # Cypress against dev server
```

## Pull requests

1. Small, focused PRs with a clear description.
2. `npm run lint` and `npm run test:unit` pass.
3. Screenshots for visible UI changes (optional but welcome).
