const router = require('express').Router();
const { requireAuth, attachUser, requireRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/dashboard.controller');

router.use(requireAuth, attachUser);

router.get('/employee', ctrl.getEmployeeDashboard);
router.get('/admin', requireRole('ADMIN', 'HR'), ctrl.getAdminDashboard);

module.exports = router;
