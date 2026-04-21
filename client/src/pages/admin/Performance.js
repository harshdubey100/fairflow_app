import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/Loader';
import { getAllPerformance } from '../../services/dashboardService';
import './Performance.css';

const Performance = () => {
  const [perfs, setPerfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPerformance()
      .then((res) => setPerfs(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <h2 className="page-title">Employee Performance</h2>
      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && (
        <div className="perf-grid">
          {perfs.length === 0 && <p style={{ color: '#5e6c84' }}>No performance data yet.</p>}
          {perfs.map((p) => (
            <div key={p.id} className="perf-card card">
              <div className="perf-name">{p.employee.name}</div>
              <div className="perf-email">{p.employee.email}</div>
              <div className="perf-stats">
                <div className="perf-stat">
                  <span className="perf-stat-val">{p.ticketsResolved}</span>
                  <span className="perf-stat-lbl">Resolved</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-stat-val">{p.avgResolutionTime.toFixed(1)}h</span>
                  <span className="perf-stat-lbl">Avg Time</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-stat-val">{p.totalStoryPoints}</span>
                  <span className="perf-stat-lbl">Points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Performance;
