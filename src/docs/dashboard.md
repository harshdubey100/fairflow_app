# Dashboard Module

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/dashboard/employee | Employee dashboard | All |
| GET | /api/dashboard/admin | Admin/HR dashboard | Admin/HR |

## Employee Dashboard Response
```json
{
  "assignedTickets": [...],
  "stats": {
    "open": 3,
    "inProgress": 2,
    "resolved": 10,
    "avgResolutionTime": 4.5,
    "totalStoryPoints": 45
  }
}
```

## Admin Dashboard Response
```json
{
  "overview": {
    "totalTickets": 100,
    "openTickets": 30,
    "inProgressTickets": 20,
    "resolvedTickets": 50
  },
  "recentTickets": [...],
  "employeePerformance": [...]
}
```

## Performance Notes
All dashboard queries run in parallel using `Promise.all` to minimize response time.
