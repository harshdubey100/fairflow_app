/**
 * FairFlow Authentication & Authorization Middleware
 * 
 * This module handles three layers of security:
 * 1. Clerk Authentication: Verify JWT tokens from the Authorization header
 * 2. User Attachment: Fetch the local database user record
 * 3. Role-Based Access Control: Check user permissions for protected routes
 * 
 * Middleware Chain:
 * router.use(requireAuth)           // Verify Clerk token → sets req.auth.userId
 * router.use(attachUser)            // Fetch DB user → sets req.user
 * router.get('/admin', requireRole('ADMIN'), handler)  // Check role
 */

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const prisma = require('../config/prisma');

// ============================================
// Layer 1: Clerk Authentication
// ============================================
/**
 * requireAuth - Verifies the Clerk session token from the Authorization header.
 * 
 * Flow:
 * 1. Extracts Bearer token from "Authorization: Bearer <token>"
 * 2. Validates token signature and expiration
 * 3. Extracts userId and attaches to req.auth.userId
 * 4. Returns 401 if token missing, invalid, or expired
 * 
 * Usage: router.use(requireAuth)
 * 
 * @throws {401} Unauthorized - If token is missing, invalid, or expired
 */
const requireAuth = ClerkExpressRequireAuth();

// ============================================
// Layer 2: Database User Attachment
// ============================================
/**
 * attachUser - Fetches the local database user after Clerk verification.
 * 
 * Prerequisites:
 * - Must be used AFTER requireAuth middleware
 * - User must have called POST /api/users/sync to create DB record
 * 
 * Flow:
 * 1. Extracts clerkId from req.auth.userId
 * 2. Queries database for user with matching clerkId
 * 3. Attaches full user object (id, email, name, role) to req.user
 * 4. Propagates to next middleware/handler
 * 
 * @throws {404} User not found - If user hasn't synced yet
 * 
 * Usage: router.use(requireAuth, attachUser)
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.auth - Clerk auth object set by requireAuth
 * @param {string} req.auth.userId - Clerk user ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const attachUser = async (req, res, next) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sync your account.' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// ============================================
// Layer 3: Role-Based Access Control (RBAC)
// ============================================
/**
 * requireRole - Role-based access control middleware.
 * 
 * Checks if the authenticated user has one of the allowed roles.
 * Commonly used roles:
 * - 'ADMIN' - System administrator with full access
 * - 'HR' - Human resources personnel with admin-like permissions
 * - 'EMPLOYEE' - Regular employee with limited access
 * 
 * Usage:
 * router.get('/admin/users', requireRole('ADMIN', 'HR'), handler)
 * // User must have ADMIN or HR role to access this route
 * 
 * Flow:
 * 1. Checks if req.user exists (set by attachUser)
 * 2. Checks if user.role is in the allowed roles list
 * 3. Returns 403 Forbidden if role doesn't match
 * 4. Proceeds to next middleware/handler if role matches
 * 
 * @param {...string} roles - Variable number of allowed role strings
 * @returns {Function} Express middleware function
 * @throws {403} Forbidden - If user role not in allowed roles
 * 
 * @example
 * // Allow only ADMIN and HR roles
 * router.get('/stats', requireRole('ADMIN', 'HR'), getStats)
 * 
 * @example
 * // Allow only ADMIN role
 * router.delete('/users/:id', requireRole('ADMIN'), deleteUser)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = { requireAuth, attachUser, requireRole };
