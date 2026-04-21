const UserModel = require('../models/user.model');
const ApiError = require('../utils/apiError');

/**
 * syncUser
 * Called after Clerk auth to upsert the user in our DB.
 * Frontend sends user info on first login.
 */
const syncUser = async ({ clerkId, email, name, role }) => {
  return UserModel.upsert(clerkId, { email, name, role: role || 'EMPLOYEE' });
};

/**
 * getUserById
 */
const getUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/**
 * getAllUsers - Admin/HR only
 */
const getAllUsers = async () => {
  return UserModel.findAll();
};

module.exports = { syncUser, getUserById, getAllUsers };
