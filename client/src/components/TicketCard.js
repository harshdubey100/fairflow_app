import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  const base = dbUser?.role === 'ADMIN' || dbUser?.role === 'HR' ? '/admin' : '/employee';

  return (
    <div
      className="ticket-card"
      onClick={() => navigate(`${base}/tickets/${ticket.id}`)}
    >
      <div className="ticket-card-header">
        <span className="ticket-title">{ticket.title}</span>
        <span className={`badge badge-${ticket.status.toLowerCase()}`}>
          {ticket.status.replace('_', ' ')}
        </span>
      </div>
      <div className="ticket-card-meta">
        <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
        <span className="ticket-points">⭐ {ticket.storyPoints} pts</span>
        {ticket.assignedTo && (
          <span className="ticket-assignee">👤 {ticket.assignedTo.name}</span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
