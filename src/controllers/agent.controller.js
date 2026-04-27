/**
 * Agent Controller
 * Proxies the chat request to the Python FastAPI agent service,
 * forwarding the user's Clerk token so the agent can call backend APIs.
 */

const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000';

/**
 * POST /api/agent/chat
 */
const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Forward the original Clerk token from the incoming request
    const authHeader = req.headers['authorization'];

    const agentRes = await fetch(`${AGENT_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        message: message.trim(),
        user_role: req.user.role,
        history,
      }),
    });

    if (!agentRes.ok) {
      const errBody = await agentRes.text();
      return res.status(agentRes.status).json({ error: errBody });
    }

    const data = await agentRes.json();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { chat };
