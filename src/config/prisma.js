/**
 * Prisma Client Configuration
 * 
 * This module exports a singleton PrismaClient instance used across the entire
 * backend application. Using a singleton prevents connection pool exhaustion by
 * ensuring only one database connection is maintained.
 * 
 * Why Singleton Pattern?
 * - Prevents multiple PrismaClient instances from being created
 * - Each instance creates its own connection pool
 * - Multiple instances = connection pool depletion and memory leaks
 * - Single instance = shared connection pool for all operations
 * 
 * Logging Configuration:
 * - Development Mode: Log all queries + errors (for debugging)
 * - Production Mode: Only log errors (minimal overhead)
 * 
 * Usage:
 * const prisma = require('./config/prisma');
 * const user = await prisma.user.findUnique({ where: { id } });
 */

const { PrismaClient } = require('@prisma/client');

/**
 * Initialize Prisma Client with logging configuration.
 * 
 * In development:
 * - 'query': Log all database queries (useful for optimization)
 * - 'error': Log all errors for debugging
 * 
 * In production:
 * - Only 'error' logs to minimize overhead and latency
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

module.exports = prisma;
