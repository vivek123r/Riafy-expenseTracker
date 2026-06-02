# Expense Tracker

A personal expense tracking web app with a fintech-grade UI. Built with React, Node.js, Express, SQLite, and Prisma.

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React 18 + Vite + TailwindCSS      |
| Backend  | Node.js + Express                  |
| Database | SQLite (local file via Prisma ORM) |
| Charts   | Recharts                           |
| Icons    | lucide-react                       |

---

## Project Structure

```
expenseTracker/
├── client/                  # React frontend (Vite, port 3000)
│   └── src/
│       ├── components/      # UI components
│       ├── hooks/           # useExpenses, useSummary, useTheme
│       ├── services/api.js  # All fetch calls
│       └── utils/format.js  # Formatters, category constants
├── server/                  # Node.js backend (Express, port 3001)
│   ├── prisma/
│   │   ├── schema.prisma    # DB schema
│   │   └── dev.db           # SQLite database file (auto-created)
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── server.js
└── package.json
```

---

## Prerequisites

- **Node.js 18+** — download from https://nodejs.org

---

## First-Time Setup

Run these commands once after cloning the repo.

**Step 1 — Set up the backend:**

```bash
cd server
npm install
npx prisma generate
npx prisma db push
```

**Step 2 — Set up the frontend (new terminal):**

```bash
cd client
npm install
```

---

## Running the App

You need **two terminals open at the same time**.

**Terminal 1 — Backend (port 3001):**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 3000):**

```bash
cd client
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Viewing & Managing the Database

### Prisma Studio — browser-based GUI (recommended)

```bash
cd server
npx prisma studio
```

Opens at **http://localhost:5555** — browse, edit, and delete records visually.

### SQLite CLI — command line

```bash
cd server
sqlite3 prisma/dev.db
```

Useful SQL commands:

```sql
SELECT * FROM Expense;                          -- view all expenses
SELECT * FROM Expense ORDER BY date DESC;       -- latest first
SELECT * FROM Expense WHERE category = 'Food';  -- filter by category
DELETE FROM Expense WHERE id = 'some-id';       -- delete a record
.quit                                           -- exit
```

### DB Browser for SQLite — desktop GUI

Download from https://sqlitebrowser.org and open `server/prisma/dev.db`.

The database file is located at:

```
server/prisma/dev.db
```

---

## API Reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint                        | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | `/expenses`                     | List expenses (supports filters) |
| GET    | `/expenses/:id`                 | Get a single expense             |
| POST   | `/expenses`                     | Create a new expense             |
| PUT    | `/expenses/:id`                 | Update an expense                |
| DELETE | `/expenses/:id`                 | Delete an expense                |
| GET    | `/summary/monthly?month=YYYY-MM`| Monthly total + category breakdown|

### Filter params for `GET /expenses`

| Param      | Example       | Description             |
|------------|---------------|-------------------------|
| `title`    | `coffee`      | Search by title         |
| `category` | `Food`        | Filter by category      |
| `dateFrom` | `2026-06-01`  | Start date (YYYY-MM-DD) |
| `dateTo`   | `2026-06-30`  | End date (YYYY-MM-DD)   |

### Expense object

```json
{
  "id": "clxyz...",
  "title": "Coffee at Starbucks",
  "amount": 250.00,
  "category": "Food",
  "date": "2026-06-02",
  "note": "Optional note"
}
```

### Available categories

`Food` `Transport` `Shopping` `Entertainment` `Health` `Bills` `Education` `Other`

---

## Environment Variables

The server reads from `server/.env` — no changes needed for local development:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
```

---

## Useful Commands

| Command                              | What it does                        |
|--------------------------------------|-------------------------------------|
| `cd server && npm run dev`           | Start backend with auto-reload      |
| `cd client && npm run dev`           | Start frontend dev server           |
| `cd server && npx prisma studio`     | Open database GUI at localhost:5555 |
| `cd server && npx prisma db push`    | Apply schema changes to the DB      |
| `cd server && npx prisma generate`   | Regenerate Prisma client after schema change |

---

## Features

- Add, edit, delete expenses with full validation
- Filter by title, category, and date range
- Monthly summary cards (total, transactions, top category, avg daily)
- Animated count-up numbers on summary cards
- Donut + bar charts for spending breakdown
- Full analytics page with month navigation
- Category breakdown with progress bars
- Dark / Light mode toggle (persisted to localStorage)
- Responsive layout — sidebar on desktop, drawer on mobile
