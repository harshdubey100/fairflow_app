const router = require('express').Router();
const { requireAuth, attachUser, requireRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/performance.controller');

router.use(requireAuth, attachUser);

// Employee: own stats
router.get('/me', ctrl.getMyPerformance);

// Admin/HR: all employees or specific employee
router.get('/', requireRole('ADMIN', 'HR'), ctrl.getAllPerformance);
router.get('/:employeeId', requireRole('ADMIN', 'HR'), ctrl.getEmployeePerformance);

module.exports = router;
