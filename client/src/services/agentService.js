import api from './api';

/**
 * Send a message to the FairFlow AI agent.
 * @param {string} message - User's message
 * @param {Array} history - [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<{reply: string}>}
 */
export const sendChatMessage = (message, history = []) =>
  api.post('/api/agent/chat', { message, history });
