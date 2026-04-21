# Auth Module

## Middlewares

### `requireAuth`
Wraps Clerk's `ClerkExpressRequireAuth`. Validates the Bearer token in the Authorization header.
Attaches `req.auth.userId` (Clerk user ID).

### `attachUser`
Fetches the local DB user using `req.auth.userId`. Attaches `req.user`.
Must be used after `requireAuth`.

### `requireRole(...roles)`
Checks `req.user.role` against allowed roles. Returns 403 if not permitted.

## User Sync Flow
On first login, the frontend must call:
```
POST /api/users/sync
Authorization: Bearer <clerk_token>
Body: { email, name }
```
This upserts the user in the local DB.

## Roles
- `EMPLOYEE` — can manage own tickets, view own performance
- `HR` — can view all tickets, all performance
- `ADMIN` — full access
