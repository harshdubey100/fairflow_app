const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, attachUser } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const ctrl = require('../controllers/ticket.controller');

// All ticket routes require authentication
router.use(requireAuth, attachUser);

// Validators
const createValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('storyPoints').optional().isInt({ min: 0, max: 100 }),
  body('assignedToId').optional().isString(),
];

const updateValidators = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('storyPoints').optional().isInt({ min: 0, max: 100 }),
  body('assignedToId').optional().isString(),
];

// Routes
router.post('/', createValidators, validate, ctrl.createTicket);
router.get('/', ctrl.getTickets);
router.get('/:id', ctrl.getTicketById);
router.patch('/:id', updateValidators, validate, ctrl.updateTicket);
router.patch('/:id/resolve', ctrl.resolveTicket);
router.get('/:id/journey', ctrl.getTicketJourney);

module.exports = router;
