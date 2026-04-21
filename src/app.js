/**
 * FairFlow Express Application Setup
 * 
 * This module initializes and configures the Express application with:
 * - Security middleware (Helmet.js for HTTP headers, CORS for cross-origin requests)
 * - Logging middleware (Morgan for HTTP request logging)
 * - Body parsing middleware for JSON and URL-encoded payloads
 * - Route handlers for all API endpoints
 * - Centralized error handling middleware
 * 
 * API Routes:
 * - POST /api/tickets - Create, list, update, resolve tickets
 * - GET /api/users - User management and sync
 * - GET /api/performance - Employee performance metrics
 * - GET /api/dashboard - Role-specific dashboard data
 * 
 * All endpoints require Clerk authentication except /health
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const ticketRoutes = require('./routes/ticket.routes');
const userRoutes = require('./routes/user.routes');
const performanceRoutes = require('./routes/performance.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ============================================
// Security & Logging Middleware
// ============================================
// Helmet: Set security HTTP headers (HSTS, X-Frame-Options, CSP, etc.)
app.use(helmet());

// CORS: Allow requests from whitelisted origins
app.use(cors({
  origin: ['https://fairflow-app-eta.vercel.app', 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
}));

// Morgan: Log all HTTP requests in development format
app.use(morgan('dev'));

// Body Parsing: Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check Endpoint (Public)
// ============================================
/**
 * GET /health
 * Returns server status (no authentication required)
 * Used for load balancers and health checks
 */
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ============================================
// API Routes (All protected via Clerk auth)
// ============================================
// Ticket Management: Create, read, update, resolve tickets and view history
app.use('/api/tickets', ticketRoutes);

// User Management: Sync Clerk users to DB, view user profiles
app.use('/api/users', userRoutes);

// Performance Metrics: View employee performance stats and comparisons
app.use('/api/performance', performanceRoutes);

// Dashboard: Role-specific dashboard data (admin vs employee)
app.use('/api/dashboard', dashboardRoutes);

// ============================================
// Centralized Error Handler (Must be last)
// ============================================
// Catches all errors thrown by route handlers and middlewares
// Returns consistent error responses with appropriate HTTP status codes
app.use(errorHandler);

module.exports = app;
