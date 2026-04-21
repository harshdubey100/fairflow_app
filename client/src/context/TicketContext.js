import React, { createContext, useContext, useState, useCallback } from 'react';
import { getTickets } from '../services/ticketService';

const TicketContext = createContext(null);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTickets(params);
      setTickets(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, pagination, loading, error, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => useContext(TicketContext);
