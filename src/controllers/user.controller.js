const userService = require('../services/user.service');

/**
 * POST /api/users/sync
 * Syncs Clerk user to local DB (called on first login from frontend)
 */
const syncUser = async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    const clerkId = req.auth.userId;
    const user = await userService.syncUser({ clerkId, email, name, role });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me
 * Returns the authenticated user's profile
 */
const getMe = async (req, res) => {
  res.json(req.user);
};

/**
 * GET /api/users
 * Returns all users (Admin/HR only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 * Returns a user by ID (Admin/HR only)
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { syncUser, getMe, getAllUsers, getUserById };
