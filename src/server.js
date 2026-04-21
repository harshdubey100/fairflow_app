/**
 * FairFlow Backend Server Entry Point
 * 
 * This is the main server file that:
 * - Loads environment variables from .env file
 * - Initializes the Express app with middleware and routes
 * - Starts the HTTP server on the specified PORT
 * 
 * Environment Variables:
 * - PORT: Server port (default: 3000)
 * - DATABASE_URL: PostgreSQL connection string
 * - CLERK_SECRET_KEY: Clerk authentication secret
 * - NODE_ENV: Environment mode (development/production)
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
