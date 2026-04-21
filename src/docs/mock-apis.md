# Mock API Reference (for Frontend Testing)

All requests require: `Authorization: Bearer <clerk_session_token>`

---

## Auth / User Sync
```
POST /api/users/sync
Body: { "email": "dev@example.com", "name": "Dev User" }
Response: { id, clerkId, email, name, role, createdAt }
```

## Get Current User
```
GET /api/users/me
Response: { id, clerkId, email, name, role }
```

---

## Tickets

### Create Ticket
```
POST /api/tickets
Body: { "title": "Login bug", "description": "SSO broken", "priority": "HIGH", "storyPoints": 5 }
Response 201: { id, title, description, status, priority, storyPoints, createdBy, assignedTo, ... }
```

### List Tickets (paginated)
```
GET /api/tickets?status=OPEN&priority=HIGH&page=1&limit=20
Response: { data: [...], pagination: { total, page, limit, totalPages } }
```

### Get Ticket
```
GET /api/tickets/:id
Response: { id, title, description, status, priority, storyPoints, createdBy, assignedTo, ... }
```

### Update Ticket
```
PATCH /api/tickets/:id
Body: { "status": "IN_PROGRESS", "assignedToId": "user_id" }
Response: updated ticket
```

### Resolve Ticket
```
PATCH /api/tickets/:id/resolve
Response: ticket with status=RESOLVED
```

### Ticket Journey
```
GET /api/tickets/:id/journey
Response: {
  ticket: { id, title, status },
  history: [{ id, action, metadata, createdAt, changedBy }]
}
```

---

## Performance

### My Performance
```
GET /api/performance/me
Response: { employee, ticketsResolved, avgResolutionTime, totalStoryPoints }
```

### All Performance (Admin/HR)
```
GET /api/performance
Response: [{ employee, ticketsResolved, avgResolutionTime, totalStoryPoints }]
```

---

## Dashboards

### Employee Dashboard
```
GET /api/dashboard/employee
Response: { assignedTickets, stats: { open, inProgress, resolved, avgResolutionTime, totalStoryPoints } }
```

### Admin Dashboard
```
GET /api/dashboard/admin
Response: { overview, recentTickets, employeePerformance }
```

---

## Status Codes
- 200 OK
- 201 Created
- 400 Bad Request (validation)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (insufficient role)
- 404 Not Found
- 409 Conflict (duplicate)
- 422 Unprocessable Entity (validation errors)
- 500 Internal Server Error
