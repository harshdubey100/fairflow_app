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

// Security & logging middleware
app.use(helmet());
app.use(cors({
  origin: ['https://fairflow-app-backend.onrender.com', 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (public)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes (all protected via Clerk middleware inside each router)
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
