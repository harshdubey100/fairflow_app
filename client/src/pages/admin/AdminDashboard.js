import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/Loader';
import TicketTable from '../../components/TicketTable';
import { getAdminDashboard } from '../../services/dashboardService';
import './AdminDashboard.css';

const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <h2 className="page-title">Admin Dashboard</h2>
      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}
      {data && (
        <>
          <div className="stats-grid">
            <StatCard label="Total" value={data.overview.totalTickets} color="#172b4d" />
            <StatCard label="Open" value={data.overview.openTickets} color="#0052cc" />
            <StatCard label="In Progress" value={data.overview.inProgressTickets} color="#ff991f" />
            <StatCard label="Resolved" value={data.overview.resolvedTickets} color="#00875a" />
          </div>

          <h3 className="section-title">Recent Tickets</h3>
          <TicketTable tickets={data.recentTickets} />

          <h3 className="section-title" style={{ marginTop: 28 }}>Employee Performance</h3>
          <table className="perf-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Resolved</th>
                <th>Avg Time (h)</th>
                <th>Story Points</th>
              </tr>
            </thead>
            <tbody>
              {data.employeePerformance.map((p) => (
                <tr key={p.id}>
                  <td>{p.employee.name}</td>
                  <td>{p.ticketsResolved}</td>
                  <td>{p.avgResolutionTime.toFixed(1)}</td>
                  <td>{p.totalStoryPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </MainLayout>
  );
};

export default AdminDashboard;
