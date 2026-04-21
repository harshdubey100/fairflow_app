/**
 * Centralized error handler middleware.
 * Catches all errors passed via next(err) and returns a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate entry: resource already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
