# Performance Module

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/performance/me | Own performance stats | Employee |
| GET | /api/performance | All employees' stats | Admin/HR |
| GET | /api/performance/:employeeId | Specific employee stats | Admin/HR |

## Performance Fields
- `ticketsResolved` — total resolved tickets
- `avgResolutionTime` — average hours from creation to resolution
- `totalStoryPoints` — sum of story points from resolved tickets

## How It's Calculated
Performance is recalculated automatically inside a Prisma transaction whenever a ticket is resolved.
The `_updatePerformance` function in `ticket.service.js` fetches all resolved tickets for the employee and recomputes the stats.

## Service Functions
- `getEmployeePerformance(employeeId)` — returns stats for one employee
- `getAllPerformance()` — returns stats for all employees, ordered by tickets resolved
