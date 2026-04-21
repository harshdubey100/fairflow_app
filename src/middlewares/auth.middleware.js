const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const prisma = require('../config/prisma');

/**
 * requireAuth - Verifies the Clerk session token from the Authorization header.
 * Attaches the Clerk userId to req.auth.
 * Usage: router.use(requireAuth)
 */
const requireAuth = ClerkExpressRequireAuth();

/**
 * attachUser - After Clerk verifies the token, fetches the local DB user
 * using the Clerk userId and attaches it to req.user.
 * Must be used AFTER requireAuth.
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

/**
 * requireRole - Role-based access control middleware.
 * @param {...string} roles - Allowed roles (e.g. 'ADMIN', 'HR')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = { requireAuth, attachUser, requireRole };
