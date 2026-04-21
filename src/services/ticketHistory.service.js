const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');

/**
 * getTicketJourney
 * Returns the full history of a ticket ordered chronologically.
 * Uses a single optimized query with joins — no N+1.
 */
const getTicketJourney = async (ticketId) => {
  // Verify ticket exists
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, title: true, status: true },
  });
  if (!ticket) throw ApiError.notFound('Ticket not found');

  const history = await prisma.ticketHistory.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      action: true,
      metadata: true,
      createdAt: true,
      changedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return { ticket, history };
};

module.exports = { getTicketJourney };
