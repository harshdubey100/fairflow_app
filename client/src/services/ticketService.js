import api from './api';

export const getTickets = (params) => api.get('/api/tickets', { params });
export const getTicketById = (id) => api.get(`/api/tickets/${id}`);
export const createTicket = (data) => api.post('/api/tickets', data);
export const updateTicket = (id, data) => api.patch(`/api/tickets/${id}`, data);
export const resolveTicket = (id) => api.patch(`/api/tickets/${id}/resolve`);
export const getTicketJourney = (id) => api.get(`/api/tickets/${id}/journey`);
