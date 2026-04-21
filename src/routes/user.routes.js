const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, attachUser, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const ctrl = require('../controllers/user.controller');

/**
 * POST /api/users/sync
 * Only needs Clerk token verification — user may not exist in DB yet.
 * Must be defined BEFORE router.use(attachUser) below.
 */
router.post(
  '/sync',
  requireAuth,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validate,
  ctrl.syncUser
);

// All routes below require a verified Clerk token + existing DB user
router.use(requireAuth, attachUser);

router.get('/me', ctrl.getMe);
router.get('/', requireRole('ADMIN', 'HR'), ctrl.getAllUsers);
router.get('/:id', requireRole('ADMIN', 'HR'), ctrl.getUserById);

module.exports = router;
