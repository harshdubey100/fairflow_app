# FairFlow Client — Frontend

React frontend for the FairFlow ticket management system.

## Setup

```bash
cd client
cp .env.example .env        # fill in your Clerk publishable key
npm install
npm start                   # runs on http://localhost:3001
```

## Folder Structure

```
src/
├── components/     Shared UI (Navbar, Sidebar, TicketCard, TicketTable, FilterBar, Modal, Loader)
├── context/        AuthContext, TicketContext, DashboardContext
├── layouts/        MainLayout (Navbar + Sidebar wrapper)
├── pages/
│   ├── Login.js
│   ├── Dashboard.js        (role-based redirect hub)
│   ├── employee/           EmployeeDashboard, MyTickets, TicketDetail
│   └── admin/              AdminDashboard, AllTickets, CreateTicket, Performance
├── routes/         ProtectedRoute
├── services/       api.js (Axios), ticketService, userService, dashboardService
└── styles/         global.css
```

## Role-Based Routing

| Role     | Redirect after login     | Can access          |
|----------|--------------------------|---------------------|
| EMPLOYEE | /employee/dashboard      | /employee/* only    |
| ADMIN    | /admin/dashboard         | all routes          |
| HR       | /admin/dashboard         | all admin routes    |

## API Integration

All data comes from `http://localhost:3000` (backend).
Clerk session token is attached automatically via Axios interceptor.

First call on login: `POST /api/users/sync` — syncs Clerk user to DB and fetches role.
