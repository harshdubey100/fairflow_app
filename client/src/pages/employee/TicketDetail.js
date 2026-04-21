import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/Loader';
import { getTicketById, getTicketJourney, resolveTicket } from '../../services/ticketService';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getTicketById(id), getTicketJourney(id)])
      .then(([tRes, jRes]) => {
        setTicket(tRes.data);
        setJourney(jRes.data.history);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load ticket'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleResolve = async () => {
    setResolving(true);
    try {
      await resolveTicket(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resolve');
    } finally {
      setResolving(false);
    }
  };

  return (
    <MainLayout>
      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}
      {ticket && (
        <div className="ticket-detail">
          <div className="ticket-detail-header">
            <div>
              <h2 className="page-title" style={{ marginBottom: 6 }}>{ticket.title}</h2>
              <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              &nbsp;
              <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>
            {ticket.status !== 'RESOLVED' && (
              <button className="btn-primary" onClick={handleResolve} disabled={resolving}>
                {resolving ? 'Resolving...' : '✓ Mark Resolved'}
              </button>
            )}
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <p style={{ color: '#172b4d', lineHeight: 1.6 }}>{ticket.description}</p>
            <div className="ticket-meta-row">
              <span>⭐ {ticket.storyPoints} story points</span>
              <span>👤 Assigned: {ticket.assignedTo?.name || 'Unassigned'}</span>
              <span>🕐 Created: {new Date(ticket.createdAt).toLocaleString()}</span>
              {ticket.resolvedAt && (
                <span>✅ Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</span>
              )}
            </div>
          </div>

          <h3 className="section-title">Ticket Journey</h3>
          {journey.length === 0
            ? <p style={{ color: '#5e6c84' }}>No history yet.</p>
            : (
              <div className="journey-list">
                {journey.map((h) => (
                  <div key={h.id} className="journey-item">
                    <div className="journey-action">{h.action.replace(/_/g, ' ')}</div>
                    <div className="journey-meta">
                      by {h.changedBy.name} · {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </MainLayout>
  );
};

export default TicketDetail;
