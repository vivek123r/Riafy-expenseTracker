# Expense Tracker

A production-quality personal expense tracker built as a full-stack web application.

## Quick Start

**Prerequisites:** Node.js 18+

### 1. Setup (run once)

```bash
# Server — install deps, generate Prisma client, create DB
cd server
npm install
npx prisma generate
npx prisma db push

# Client — install deps
cd ../client
npm install
```

### 2. Run

```bash
# Terminal 1 — backend on http://localhost:3001
cd server
npm run dev

# Terminal 2 — frontend on http://localhost:3000
cd client
npm run dev
```

Open **http://localhost:3000**

---

## Tech Stack

| Layer      | Technology                  | Rationale                                                       |
|------------|-----------------------------|-----------------------------------------------------------------|
| Frontend   | React 18 + Vite             | Fast HMR, minimal config                                        |
| Styling    | TailwindCSS                 | Utility-first, consistent spacing and colors, no stylesheet bloat |
| Charts     | Recharts                    | Declarative, composable React charts — Pie chart for breakdown  |
| Icons      | lucide-react                | Lightweight, consistent SVG icons                               |
| Backend    | Node.js + Express           | Minimal boilerplate REST API                                    |
| ORM        | Prisma                      | Type-safe DB client, easy migrations, great SQLite support       |
| Database   | SQLite (via Prisma)         | Zero-config local file, no server needed                        |
| Validation | express-validator           | Declarative field validation, standard middleware pattern        |

**Tradeoff:** Prisma adds a generation step (`prisma generate`) but provides a much better developer experience than raw SQL or a lighter ORM. For a local SQLite app the cold-start overhead is negligible.

---

## Architecture

```
server/
  prisma/schema.prisma    — DB schema (Expense model)
  lib/prisma.js           — Prisma singleton
  routes/                 — Express routers (expenses, summary)
  controllers/            — Thin request/response handlers
  services/expenseService — All business logic & DB queries
  middleware/             — errorHandler, validate

client/
  src/
    services/api.js       — All fetch calls (thin API layer)
    hooks/useExpenses.js  — Data-fetching hooks (loading/error state)
    utils/format.js       — Formatting helpers, category constants
    components/           — Reusable UI components
    App.jsx               — Root layout and state orchestration
```

---

## API

| Method | Path                        | Description                                |
|--------|-----------------------------|--------------------------------------------|
| GET    | /api/expenses               | List (filter: category, dateFrom, dateTo, title) |
| GET    | /api/expenses/:id           | Get single expense                         |
| POST   | /api/expenses               | Create expense                             |
| PUT    | /api/expenses/:id           | Update expense                             |
| DELETE | /api/expenses/:id           | Delete expense                             |
| GET    | /api/summary/monthly?month= | Monthly total + category breakdown         |

---

## Features Completed

- [x] Add expense with full validation (client + server)
- [x] List all expenses sorted by date descending
- [x] Edit expense via modal dialog (pre-filled form)
- [x] Delete with confirmation
- [x] Filter by category, date range, title (partial match) — combined
- [x] Monthly summary: total, transaction count, category breakdown with % 
- [x] Recharts Pie chart with category colors
- [x] Month navigation (previous/next)
- [x] Mobile-responsive layout (table collapses to cards)
- [x] Loading states, empty states, error states
- [x] Invalid date range guard (from > to)

## Features Skipped

- Authentication / user accounts (out of scope per spec)
- Pagination (personal use, <1000 rows is fine)
- Test suite
- Deployment config

## Known Limitations

- Dates are stored as `TEXT` in SQLite (`YYYY-MM-DD`). This is correct for sorting but has no timezone handling — all dates are treated as local calendar dates.
- `prisma generate` must be re-run after any schema change.
- The Vite proxy (`/api` → `localhost:3001`) only works in dev mode. Production would need a reverse proxy or monorepo serving strategy.
- Future dates are accepted (no validation against today) — intentional, to allow pre-entering planned expenses.
