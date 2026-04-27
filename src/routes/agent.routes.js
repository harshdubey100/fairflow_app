/**
 * Agent Routes
 * Proxies chat requests to the Python LangGraph agent microservice.
 * The Clerk token is forwarded so the agent can call backend APIs as the user.
 */

const router = require('express').Router();
const { requireAuth, attachUser } = require('../middlewares/auth.middleware');
const agentController = require('../controllers/agent.controller');

// All agent routes require a valid Clerk session + DB user
router.use(requireAuth, attachUser);

/**
 * POST /api/agent/chat
 * Body: { message: string, history?: [{role, content}] }
 * Returns: { reply: string }
 */
router.post('/chat', agentController.chat);

module.exports = router;
