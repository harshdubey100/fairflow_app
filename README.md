# FairFlow - Intelligent Ticket Management System

This is a full-stack web application built with FairFlow, an intelligent ticket management system. It features user authentication, role-based access control, ticket creation/management, and performance tracking.

## Architecture

The application follows a client-server architecture:

- **Frontend**: React.js application with routing, authentication, and UI components.
- **Backend**: Node.js/Express API server with database integration.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: Clerk for user management and JWT tokens.

## Project Structure

### Root Directory
- `package.json` - Backend dependencies and scripts.
- `.env` - Environment variables for backend (database, Clerk keys, port).
- `prisma/` - Database schema and migrations.
- `src/` - Backend source code.

### Backend (`src/`)
- `app.js` - Main Express app setup, middleware, and route mounting.
- `server.js` - Server entry point, starts the app on specified port.
- `config/` - Configuration files (e.g., Prisma client).
- `controllers/` - Route handlers for business logic.
- `middlewares/` - Express middlewares (auth, validation, error handling).
- `models/` - Data models (Prisma-based).
- `routes/` - API route definitions.
- `services/` - Business logic services.
- `utils/` - Utility functions (e.g., API error handling, pagination).
- `docs/` - API documentation.

### Frontend (`client/`)
- `package.json` - Frontend dependencies and scripts.
- `.env` - Environment variables for frontend (Clerk publishable key, API URL).
- `public/` - Static assets.
- `src/`
  - `App.js` - Main React app component with routing.
  - `index.js` - App entry point, wraps with ClerkProvider.
  - `components/` - Reusable UI components (Navbar, Sidebar, TicketCard, etc.).
  - `context/` - React contexts for state management (Auth, Ticket, Dashboard).
  - `layouts/` - Layout components (MainLayout).
  - `pages/` - Page components organized by role (admin, employee).
  - `routes/` - Route protection logic.
  - `services/` - API service functions (axios-based).
  - `styles/` - CSS files for components.

## Key Features

### Authentication & Authorization
- Clerk handles user sign-up/sign-in.
- Role-based access: Admin/HR and Employee roles.
- JWT tokens for API authentication.

### Ticket Management
- Create, view, update, and delete tickets.
- Status tracking (Open, In Progress, Resolved, Closed).
- Priority levels and assignments.

### Dashboard & Analytics
- Role-specific dashboards.
- Performance metrics and reporting.

### API Endpoints
- `/api/tickets` - Ticket CRUD operations.
- `/api/users` - User management.
- `/api/performance` - Analytics data.
- `/api/dashboard` - Dashboard data.

## Development Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Clerk account for authentication keys

### Backend Setup
1. Install dependencies: `npm install`
2. Set up database: Configure `DATABASE_URL` in `.env`
3. Run Prisma migrations: `npx prisma migrate dev`
4. Start server: `npm start` (runs on port 3001)

### Frontend Setup
1. Navigate to client: `cd client`
2. Install dependencies: `npm install`
3. Configure environment: Set `REACT_APP_CLERK_PUBLISHABLE_KEY` in `client/.env`
4. Start dev server: `npm start` (runs on port 3000, proxies API to 3001)

### Environment Variables

#### Backend (.env)
- `PORT=3001` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `NODE_ENV=development` - Environment mode

#### Frontend (client/.env)
- `REACT_APP_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `REACT_APP_API_URL` - API base URL (defaults to '/' for proxy)

## How It Works

1. **User Access**: Users sign in via Clerk, which provides authentication tokens.
2. **Role Determination**: On login, the app fetches user details from the database and determines role.
3. **Dashboard Loading**: Based on role, users are redirected to appropriate dashboard.
4. **API Communication**: Frontend makes authenticated requests to backend APIs via proxy.
5. **Data Flow**: Backend validates tokens, processes requests, interacts with database via Prisma.
6. **State Management**: React contexts manage global state across components.

## Common Issues & Solutions

- **Constant Loading**: Check if backend is running and API endpoints are responding. Ensure Clerk keys are correct.
- **Authentication Errors**: Verify JWT tokens are being sent with requests.
- **Database Connection**: Ensure PostgreSQL is running and DATABASE_URL is correct.
- **Port Conflicts**: Backend runs on 3001, frontend on 3000 with proxy to 3001.

## Technologies Used

- **Frontend**: React, React Router, Axios, Clerk React
- **Backend**: Node.js, Express.js, Prisma, PostgreSQL
- **Authentication**: Clerk
- **Styling**: CSS modules
- **Development**: Create React App, Nodemon