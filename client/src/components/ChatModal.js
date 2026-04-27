import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ChatModal.css';

// ── Suggestion chips ──────────────────────────────────────────────────────────
const EMPLOYEE_SUGGESTIONS = [
  'Show my open tickets',
  'What are my performance stats?',
  'Show my in-progress tickets',
  'What is my dashboard summary?',
];

const ADMIN_SUGGESTIONS = [
  'Show all open tickets',
  'Show high priority tickets',
  'Show all employee performance',
  'Give me the admin dashboard summary',
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Component ─────────────────────────────────────────────────────────────────
const ChatModal = () => {
  const { dbUser, isSignedIn } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Keep a ref to messages so async callbacks always see the latest value
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  // Track whether we've already shown the welcome message
  const welcomeShownRef = useRef(false);

  const isAdmin = dbUser?.role === 'ADMIN' || dbUser?.role === 'HR';
  const suggestions = isAdmin ? ADMIN_SUGGESTIONS : EMPLOYEE_SUGGESTIONS;

  // Keep dbUser in a ref so the open-effect can read it without being a dep
  const dbUserRef = useRef(dbUser);
  useEffect(() => { dbUserRef.current = dbUser; }, [dbUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input + show welcome on open
  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 80);
    if (!welcomeShownRef.current) {
      welcomeShownRef.current = true;
      const name = dbUserRef.current?.name?.split(' ')[0] || 'there';
      setMessages([{
        role: 'assistant',
        content: `Hi ${name}! 👋 I'm your FairFlow assistant. Ask me about tickets, performance stats, or anything in the system.`,
        time: new Date(),
      }]);
    }
  }, [open]);

  // Core send — accepts explicit text so suggestion chips bypass the input state
  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    setInput('');
    setError('');

    const userMsg = { role: 'user', content: trimmed, time: new Date() };

    // Build history from the ref so we always have the latest messages
    const currentMessages = messagesRef.current;
    const history = currentMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/api/agent/chat', { message: trimmed, history });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply, time: new Date() },
      ]);
    } catch (err) {
      const detail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Something went wrong. Please try again.';
      setError(detail);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ ' + detail, time: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setError('');
    welcomeShownRef.current = true;
    const name = dbUserRef.current?.name?.split(' ')[0] || 'there';
    setMessages([{
      role: 'assistant',
      content: `Hi ${name}! 👋 I'm your FairFlow assistant. Ask me about tickets, performance stats, or anything in the system.`,
      time: new Date(),
    }]);
  };

  if (!isSignedIn || !dbUser) return null;

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      {/* Floating action button */}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        title="FairFlow Assistant"
        aria-label="Open AI assistant"
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-overlay" role="dialog" aria-modal="true" aria-label="FairFlow Assistant">
          <div className="chat-window">

            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar" aria-hidden="true">✨</div>
                <div>
                  <div className="chat-header-title">FairFlow Assistant</div>
                  <div className="chat-header-sub">Powered by Qwen2.5-72B</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="chat-close-btn"
                  onClick={clearChat}
                  title="Clear chat"
                  aria-label="Clear chat history"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                  </svg>
                </button>
                <button
                  className="chat-close-btn"
                  onClick={() => setOpen(false)}
                  title="Close"
                  aria-label="Close assistant"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages" role="log" aria-live="polite">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className="chat-bubble">{msg.content}</div>
                  <span className="chat-time">{formatTime(msg.time)}</span>
                </div>
              ))}

              {loading && (
                <div className="chat-msg assistant">
                  <div className="chat-typing" aria-label="Assistant is typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            {showSuggestions && (
              <div className="chat-suggestions" role="group" aria-label="Suggested questions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="chat-suggestion-btn"
                    onClick={() => sendMessage(s)}
                    disabled={loading}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Error banner */}
            {error && <div className="chat-error" role="alert">{error}</div>}

            {/* Input */}
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                rows={1}
                placeholder="Ask about tickets, performance…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Message input"
              />
              <button
                className="chat-send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
