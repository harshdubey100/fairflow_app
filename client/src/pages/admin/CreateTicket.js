import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { createTicket } from '../../services/ticketService';
import { getAllUsers } from '../../services/userService';
import './CreateTicket.css';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM',
    storyPoints: 0, assignedToId: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createTicket({
        ...form,
        storyPoints: parseInt(form.storyPoints) || 0,
        assignedToId: form.assignedToId || undefined,
      });
      navigate('/admin/tickets');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <h2 className="page-title">Create Ticket</h2>
      <div className="card create-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Story Points</label>
              <input type="number" name="storyPoints" min={0} max={100}
                value={form.storyPoints} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Assign To</label>
            <select name="assignedToId" value={form.assignedToId} onChange={handleChange}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/tickets')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateTicket;
