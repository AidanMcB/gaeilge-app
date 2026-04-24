# REST API reference

Base URL: set `VITE_API_BASE_URL` in the Vue app (e.g. `http://localhost:3004` locally).

Unless noted, JSON bodies use `Content-Type: application/json`.

## Auth headers

- **Signed-in:** `Authorization: Bearer <Firebase_ID_token>` (client also uses cookies per login flow).
- **Guest:** `X-Guest-Mode: true` for routes behind `verifyToken` when using guest mode.

---

## Health

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/` | No |

Returns API info JSON.

---

## Users

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/users` | No |
| `GET` | `/users/:id` | No |

---

## Notecards

All routes use `verifyToken` (Bearer or guest header).

| Method | Path | Description |
|--------|------|----------------|
| `GET` | `/notecards` | List notecards for the current user / guest context. |
| `POST` | `/notecards/create` | Create a notecard. |
| `PUT` | `/notecards/:id` | Update a notecard. |
| `DELETE` | `/notecards/:id` | Delete a notecard. |
| `DELETE` | `/notecards/:noteCardId/categories/:categoryId` | Remove category association. |

---

## Categories

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/categories` | No |
| `POST` | `/categories/create` | No (body: `{ "name": string }`) |
| `DELETE` | `/categories/:id` | No |

---

## Firebase / session

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/auth/verify` | Bearer token in body/header per controller |
| `POST` | `/auth/users/create` | Body: `username`, `email`, `password` — creates Firebase user + DB row. |
| `POST` | `/auth/users/login` | Body: `idToken` — verifies token, sets cookie, returns `{ data: { user } }`. |
| `GET` | `/auth/users/me` | `verifyToken` — current user profile. |

> **Note:** Exact request/response shapes may evolve; treat this as a map to the Express routes in `gaeilge-app-api/index.js` and controllers under `src/controllers/`.
