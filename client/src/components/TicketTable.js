import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './TicketTable.css';

const TicketTable = ({ tickets }) => {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  // Route ticket detail links by logged-in role.
  const base = dbUser?.role === 'ADMIN' || dbUser?.role === 'HR' ? '/admin' : '/employee';

  if (!tickets?.length) return <p style={{ color: '#5e6c84' }}>No tickets found.</p>;

  return (
    <table className="ticket-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Points</th>
          <th>Assigned To</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr
            key={t.id}
            // Entire row is clickable for faster navigation in lists.
            onClick={() => navigate(`${base}/tickets/${t.id}`)}
            className="ticket-row"
          >
            <td>{t.title}</td>
            <td>
              <span className={`badge badge-${t.status.toLowerCase()}`}>
                {t.status.replace('_', ' ')}
              </span>
            </td>
            <td>
              <span className={`badge badge-${t.priority.toLowerCase()}`}>
                {t.priority}
              </span>
            </td>
            <td>{t.storyPoints}</td>
            <td>{t.assignedTo?.name || '—'}</td>
            <td>{new Date(t.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketTable;
