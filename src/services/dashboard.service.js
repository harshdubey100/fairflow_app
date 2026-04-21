const prisma = require('../config/prisma');

/**
 * getEmployeeDashboard
 * Returns assigned tickets + personal performance stats for an employee.
 * Uses Promise.all for parallel queries — no sequential blocking.
 */
const getEmployeeDashboard = async (userId) => {
  const [assignedTickets, performance, openCount, inProgressCount] = await Promise.all([
    prisma.ticket.findMany({
      where: { assignedToId: userId, status: { not: 'RESOLVED' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true, title: true, status: true, priority: true,
        storyPoints: true, createdAt: true,
      },
    }),
    prisma.performance.findUnique({ where: { employeeId: userId } }),
    prisma.ticket.count({ where: { assignedToId: userId, status: 'OPEN' } }),
    prisma.ticket.count({ where: { assignedToId: userId, status: 'IN_PROGRESS' } }),
  ]);

  return {
    assignedTickets,
    stats: {
      open: openCount,
      inProgress: inProgressCount,
      resolved: performance?.ticketsResolved || 0,
      avgResolutionTime: performance?.avgResolutionTime || 0,
      totalStoryPoints: performance?.totalStoryPoints || 0,
    },
  };
};

/**
 * getAdminDashboard
 * Returns system-wide ticket overview + all employee performance.
 * All queries run in parallel.
 */
const getAdminDashboard = async () => {
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    recentTickets,
    allPerformance,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: 'OPEN' } }),
    prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.ticket.count({ where: { status: 'RESOLVED' } }),
    prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true, title: true, status: true, priority: true,
        createdAt: true,
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.performance.findMany({
      include: { employee: { select: { id: true, name: true, email: true } } },
      orderBy: { ticketsResolved: 'desc' },
    }),
  ]);

  return {
    overview: { totalTickets, openTickets, inProgressTickets, resolvedTickets },
    recentTickets,
    employeePerformance: allPerformance,
  };
};

module.exports = { getEmployeeDashboard, getAdminDashboard };
