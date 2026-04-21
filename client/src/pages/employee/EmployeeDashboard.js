import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/Loader';
import TicketCard from '../../components/TicketCard';
import { getEmployeeDashboard } from '../../services/dashboardService';
import './EmployeeDashboard.css';

const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEmployeeDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <h2 className="page-title">My Dashboard</h2>
      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}
      {data && (
        <>
          <div className="stats-grid">
            <StatCard label="Open" value={data.stats.open} color="#0052cc" />
            <StatCard label="In Progress" value={data.stats.inProgress} color="#ff991f" />
            <StatCard label="Resolved" value={data.stats.resolved} color="#00875a" />
            <StatCard label="Story Points" value={data.stats.totalStoryPoints} color="#6554c0" />
            <StatCard
              label="Avg Resolution"
              value={`${data.stats.avgResolutionTime.toFixed(1)}h`}
              color="#00b8d9"
            />
          </div>

          <h3 className="section-title">Active Tickets</h3>
          {data.assignedTickets.length === 0
            ? <p style={{ color: '#5e6c84' }}>No active tickets.</p>
            : data.assignedTickets.map((t) => <TicketCard key={t.id} ticket={t} />)
          }
        </>
      )}
    </MainLayout>
  );
};

export default EmployeeDashboard;
