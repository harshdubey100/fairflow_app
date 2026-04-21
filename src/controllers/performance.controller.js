const performanceService = require('../services/performance.service');

/**
 * GET /api/performance/me
 * Returns performance stats for the authenticated employee
 */
const getMyPerformance = async (req, res, next) => {
  try {
    const perf = await performanceService.getEmployeePerformance(req.user.id);
    res.json(perf);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/performance/:employeeId
 * Returns performance stats for a specific employee (Admin/HR only)
 */
const getEmployeePerformance = async (req, res, next) => {
  try {
    const perf = await performanceService.getEmployeePerformance(req.params.employeeId);
    res.json(perf);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/performance
 * Returns all employees' performance (Admin/HR only)
 */
const getAllPerformance = async (req, res, next) => {
  try {
    const perfs = await performanceService.getAllPerformance();
    res.json(perfs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyPerformance, getEmployeePerformance, getAllPerformance };
