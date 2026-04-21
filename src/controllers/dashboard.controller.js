const dashboardService = require('../services/dashboard.service');

/**
 * GET /api/dashboard/employee
 * Employee dashboard: assigned tickets + personal stats
 */
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getEmployeeDashboard(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/admin
 * Admin/HR dashboard: system overview + all employee performance
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getEmployeeDashboard, getAdminDashboard };
