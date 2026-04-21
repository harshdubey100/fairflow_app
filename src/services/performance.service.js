const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');

/**
 * getEmployeePerformance
 * Returns performance stats for a single employee.
 */
const getEmployeePerformance = async (employeeId) => {
  const perf = await prisma.performance.findUnique({
    where: { employeeId },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
  });

  if (!perf) {
    // Return zeroed stats if no resolved tickets yet
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      select: { id: true, name: true, email: true },
    });
    if (!employee) throw ApiError.notFound('Employee not found');
    return { employee, ticketsResolved: 0, avgResolutionTime: 0, totalStoryPoints: 0 };
  }

  return perf;
};

/**
 * getAllPerformance
 * Returns performance stats for all employees. Used by HR/Admin dashboard.
 * Batched single query — no N+1.
 */
const getAllPerformance = async () => {
  return prisma.performance.findMany({
    include: {
      employee: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { ticketsResolved: 'desc' },
  });
};

module.exports = { getEmployeePerformance, getAllPerformance };
