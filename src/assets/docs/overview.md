# Cleachtadh Gaeilge — Overview

**Cleachtadh Gaeilge** is a practice app for Irish (*Gaeilge*). It helps learners reinforce vocabulary and grammar through short, focused exercises.

## Features

- **Multiple-choice quizzes** — Questions are grouped by section; progress through a section and see a results summary.
- **Matching** — Pair Irish terms with their meanings or translations for a given section.
- **Notecards** — Create, edit, and organize flashcards backed by the API, with optional categories.
- **Authentication** — Email/password sign-in via Firebase, synced with a custom user record in PostgreSQL.
- **Guest mode** — Try the app without an account; API calls run with a guest header where supported.

## Who it is for

- Learners who want quick repetition and feedback.
- Developers reviewing this repo as a **portfolio** example of a Vue 3 + Pinia + PrimeVue + REST API stack.

## Guest vs signed-in

| | Guest | Signed-in |
|---|--------|-----------|
| Quizzes / matching | Yes (static JSON) | Yes |
| Notecards API | Limited / guest header | Full CRUD tied to user |

See **Architecture** for how auth and data flow through the stack.
