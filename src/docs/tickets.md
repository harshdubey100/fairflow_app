# Tickets Module

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/tickets | Create ticket | All |
| GET | /api/tickets | List tickets (filtered, paginated) | All |
| GET | /api/tickets/:id | Get ticket by ID | All |
| PATCH | /api/tickets/:id | Update ticket | All |
| PATCH | /api/tickets/:id/resolve | Resolve ticket | All |
| GET | /api/tickets/:id/journey | Get ticket history | All |

## Filters (GET /api/tickets)
- `status` — OPEN | IN_PROGRESS | RESOLVED
- `priority` — LOW | MEDIUM | HIGH | CRITICAL
- `assignedToId` — filter by assignee (Admin/HR only; employees see only their own)
- `page`, `limit` — pagination

## Create Ticket Body
```json
{
  "title": "Bug in login",
  "description": "Users can't log in with SSO",
  "priority": "HIGH",
  "storyPoints": 5,
  "assignedToId": "user_id_optional"
}
```

## Service Functions
- `createTicket(data, createdById)` — creates ticket + CREATED history in a transaction
- `getTickets(query, userId, role)` — paginated list with role-based filtering
- `getTicketById(id)` — single ticket fetch
- `updateTicket(id, updates, changedById)` — updates + logs history + updates performance on resolve
- `resolveTicket(id, changedById)` — sets status to RESOLVED

## Performance Impact
When a ticket is resolved, `_updatePerformance` recalculates the assigned employee's stats in the same transaction.
