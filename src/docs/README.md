# FairFlow Ticket Management System — Backend

## Tech Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- Clerk (authentication)
- MVC architecture

## Project Structure
```
src/
├── app.js              # Express app setup
├── server.js           # Entry point
├── config/
│   └── prisma.js       # Prisma singleton client
├── controllers/        # Thin HTTP handlers
├── services/           # Business logic
├── models/             # Prisma query helpers
├── routes/             # Route definitions + validators
├── middlewares/        # Auth, error, validation
├── utils/              # Helpers (pagination, errors)
└── docs/               # Module documentation
prisma/
└── schema.prisma       # DB schema
```

## Setup
1. Copy `.env.example` to `.env` and fill in values
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run dev`

## Authentication Flow
1. Frontend authenticates with Clerk
2. Frontend calls `POST /api/users/sync` with user info + Clerk session token
3. All subsequent requests include `Authorization: Bearer <clerk_token>`
4. Backend verifies token via Clerk middleware, fetches DB user
