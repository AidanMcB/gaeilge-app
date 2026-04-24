# Cleachtadh Gaeilge — `gaeilge-app`

Vue 3 + Vite + TypeScript SPA for Irish language practice (quizzes, matching games, notecards).

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **Vue Router** + **Pinia**
- **PrimeVue 4** + **Tailwind CSS**
- **Firebase** (client auth)
- **Axios** via shared `src/services/httpClient.ts`

## Prerequisites

- Node.js **≥ 20**
- Running instance of [`gaeilge-app-api`](../gaeilge-app-api/) (or deployed API URL)

## Environment variables

Copy `.env.example` to `.env` and fill values:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | REST API base URL (e.g. `http://localhost:3004`) |
| `VITE_FIREBASE_API_KEY` | Firebase web app key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics (optional) |

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. In-app documentation is at **`/docs`**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run type-check` | `vue-tsc` only |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest |
| `npm run test:e2e` | Cypress against preview (build first) |
| `npm run test:e2e:dev` | Cypress + dev server on port 4173 |
| `npm run cy:open` | Cypress interactive runner |

## IDE

VS Code + [Vue — Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar) recommended.

## Project conventions

See repo root [`AGENTS.md`](../AGENTS.md) and [`.cursor/rules/`](../.cursor/rules/).
