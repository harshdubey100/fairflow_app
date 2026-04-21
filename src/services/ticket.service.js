const prisma = require('../config/prisma');
const TicketModel = require('../models/ticket.model');
const ApiError = require('../utils/apiError');
const { getPaginationParams, buildPaginatedResponse } = require('../utils/pagination');

/**
 * createTicket
 * Creates a new ticket and logs a CREATED history entry in a transaction.
 */
const createTicket = async ({ title, description, priority, storyPoints, assignedToId }, createdById) => {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        storyPoints: storyPoints || 0,
        createdById,
        assignedToId: assignedToId || null,
      },
      select: TicketModel.ticketSelect,
    });

    await tx.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        changedById: createdById,
        action: 'CREATED',
        metadata: { title, priority, assignedToId },
      },
    });

    return ticket;
  });
};

/**
 * getTickets
 * Fetches tickets with filters and pagination. Avoids N+1 via select.
 */
const getTickets = async (query, userId, userRole) => {
  const { skip, take, page, limit } = getPaginationParams(query);
  const { status, priority, assignedToId } = query;

  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;

  // Employees only see their own assigned tickets
  if (userRole === 'EMPLOYEE') {
    where.assignedToId = userId;
  } else if (assignedToId) {
    where.assignedToId = assignedToId;
  }

  const [tickets, total] = await Promise.all([
    TicketModel.findMany(where, skip, take),
    TicketModel.count(where),
  ]);

  return buildPaginatedResponse(tickets, total, page, limit);
};

/**
 * getTicketById
 */
const getTicketById = async (id) => {
  const ticket = await TicketModel.findById(id);
  if (!ticket) throw ApiError.notFound('Ticket not found');
  return ticket;
};

/**
 * updateTicket
 * Updates ticket fields and logs history. Handles resolution time tracking.
 */
const updateTicket = async (id, updates, changedById) => {
  const existing = await TicketModel.findById(id);
  if (!existing) throw ApiError.notFound('Ticket not found');

  return prisma.$transaction(async (tx) => {
    const data = { ...updates };

    // Track resolution timestamp
    if (updates.status === 'RESOLVED' && existing.status !== 'RESOLVED') {
      data.resolvedAt = new Date();
    }
    if (updates.status && updates.status !== 'RESOLVED') {
      data.resolvedAt = null;
    }

    const ticket = await tx.ticket.update({
      where: { id },
      data,
      select: TicketModel.ticketSelect,
    });

    // Determine action type for history
    let action = 'UPDATED';
    if (updates.status === 'RESOLVED') action = 'RESOLVED';
    else if (updates.status) action = 'STATUS_CHANGED';
    else if (updates.assignedToId) action = 'ASSIGNED';
    else if (updates.priority) action = 'PRIORITY_CHANGED';

    await tx.ticketHistory.create({
      data: {
        ticketId: id,
        changedById,
        action,
        metadata: updates,
      },
    });

    // Update performance stats if resolved
    // ticket.assignedTo is the nested object from ticketSelect; extract the id
    const assignedToId = ticket.assignedTo?.id || null;
    if (updates.status === 'RESOLVED' && assignedToId) {
      await _updatePerformance(tx, assignedToId);
    }

    return ticket;
  });
};

/**
 * resolveTicket
 * Convenience wrapper to resolve a ticket.
 */
const resolveTicket = async (id, changedById) => {
  return updateTicket(id, { status: 'RESOLVED' }, changedById);
};

/**
 * _updatePerformance (private)
 * Recalculates and upserts performance stats for the assigned employee.
 * @param {object} tx - Prisma transaction client
 * @param {string} assignedToId - The employee's DB user id
 */
const _updatePerformance = async (tx, assignedToId) => {
  const resolvedTickets = await tx.ticket.findMany({
    where: {
      assignedToId,
      status: 'RESOLVED',
      resolvedAt: { not: null },
    },
    select: { createdAt: true, resolvedAt: true, storyPoints: true },
  });

  const count = resolvedTickets.length;
  const totalStoryPoints = resolvedTickets.reduce((sum, t) => sum + t.storyPoints, 0);
  const totalHours = resolvedTickets.reduce((sum, t) => {
    const diff = (new Date(t.resolvedAt) - new Date(t.createdAt)) / 3600000;
    return sum + diff;
  }, 0);
  const avgResolutionTime = count > 0 ? totalHours / count : 0;

  await tx.performance.upsert({
    where: { employeeId: assignedToId },
    update: { ticketsResolved: count, avgResolutionTime, totalStoryPoints },
    create: {
      employeeId: assignedToId,
      ticketsResolved: count,
      avgResolutionTime,
      totalStoryPoints,
    },
  });
};

module.exports = { createTicket, getTickets, getTicketById, updateTicket, resolveTicket };
