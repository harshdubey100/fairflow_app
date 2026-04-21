const ticketService = require('../services/ticket.service');
const historyService = require('../services/ticketHistory.service');

/**
 * POST /api/tickets
 * Create a new ticket
 */
const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user.id);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tickets
 * Fetch tickets with filters and pagination
 */
const getTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query, req.user.id, req.user.role);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tickets/:id
 * Get a single ticket by ID
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tickets/:id
 * Update ticket fields
 */
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body, req.user.id);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tickets/:id/resolve
 * Resolve a ticket
 */
const resolveTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.resolveTicket(req.params.id, req.user.id);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tickets/:id/journey
 * Get full ticket history/journey
 */
const getTicketJourney = async (req, res, next) => {
  try {
    const journey = await historyService.getTicketJourney(req.params.id);
    res.json(journey);
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateTicket, resolveTicket, getTicketJourney };
