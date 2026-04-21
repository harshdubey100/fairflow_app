const prisma = require('../config/prisma');

/**
 * Ticket model helpers — thin wrappers around Prisma queries.
 * All business logic lives in the service layer.
 */

const ticketSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  storyPoints: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
  createdBy: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
};

const findMany = (where, skip, take, orderBy = { createdAt: 'desc' }) =>
  prisma.ticket.findMany({ where, skip, take, orderBy, select: ticketSelect });

const count = (where) => prisma.ticket.count({ where });

const findById = (id) =>
  prisma.ticket.findUnique({ where: { id }, select: ticketSelect });

const create = (data) => prisma.ticket.create({ data, select: ticketSelect });

const update = (id, data) =>
  prisma.ticket.update({ where: { id }, data, select: ticketSelect });

module.exports = { findMany, count, findById, create, update, ticketSelect };
