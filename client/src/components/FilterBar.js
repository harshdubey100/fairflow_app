import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilter }) => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const handleApply = () => onFilter({ status, priority });
  const handleReset = () => {
    setStatus('');
    setPriority('');
    onFilter({});
  };

  return (
    <div className="filter-bar">
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      <button className="btn-primary" onClick={handleApply}>Filter</button>
      <button className="btn-secondary" onClick={handleReset}>Reset</button>
    </div>
  );
};

export default FilterBar;
