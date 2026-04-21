import React, { useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import FilterBar from '../../components/FilterBar';
import TicketTable from '../../components/TicketTable';
import Loader from '../../components/Loader';
import { useTicketContext } from '../../context/TicketContext';

const MyTickets = () => {
  const { tickets, pagination, loading, error, fetchTickets } = useTicketContext();

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleFilter = (filters) => fetchTickets(filters);

  return (
    <MainLayout>
      <h2 className="page-title">My Tickets</h2>
      <FilterBar onFilter={handleFilter} />
      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}
      {!loading && <TicketTable tickets={tickets} />}
      {pagination.totalPages > 1 && (
        <p style={{ marginTop: 12, color: '#5e6c84', fontSize: 13 }}>
          Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
        </p>
      )}
    </MainLayout>
  );
};

export default MyTickets;
