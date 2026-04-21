/**
 * Centralized Error Handler Middleware
 * 
 * This middleware catches all errors thrown or passed via next(err) from:
 * - Route handlers
 * - Service functions
 * - Other middleware
 * 
 * Responsibilities:
 * 1. Log error details to console for debugging
 * 2. Map Prisma-specific error codes to HTTP status codes
 * 3. Return consistent JSON error responses
 * 4. Prevent internal error details from leaking to clients
 * 
 * Error Handling Strategy:
 * - Prisma P2002 (Unique constraint) → 409 Conflict
 * - Prisma P2025 (Record not found) → 404 Not Found
 * - Custom ApiError with statusCode → Use provided status code
 * - All others → 500 Internal Server Error
 * 
 * Must be registered LAST in middleware chain:
 * app.use(errorHandler)
 * 
 * @param {Error} err - The error object
 * @param {Object} err.code - Prisma error code (optional)
 * @param {number} err.statusCode - Custom status code (optional)
 * @param {string} err.message - Error message to send to client
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function (required by Express but unused)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ============================================
  // Step 1: Log error for debugging
  // ============================================
  console.error(`[ERROR] ${err.message}`, err.stack);

  // ============================================
  // Step 2: Handle Prisma-specific errors
  // ============================================
  // P2002: Unique constraint violation (duplicate email, clerkId, etc.)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate entry: resource already exists.' });
  }

  // P2025: Record not found when attempting to update/delete
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found.' });
  }

  // ============================================
  // Step 3: Return error response to client
  // ============================================
  // Use statusCode from custom ApiError, or default to 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
