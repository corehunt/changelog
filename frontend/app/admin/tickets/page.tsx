'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DashboardTicketsList } from '@/components/DashboardTicketsList';
import { getTickets, TicketFilters, TicketSort } from '@/lib/api/tickets';
import { Ticket } from '@/lib/types';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AUTH_ENABLED } from '@/lib/auth/config';

const DEFAULT_FILTERS: TicketFilters = {};
const DEFAULT_SORT: TicketSort = {
  field: 'start_date',
  direction: 'desc',
};

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TicketSort>(DEFAULT_SORT);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      try {
        setLoading(true);

        const response = await getTickets(filters, sort, { page, pageSize });

        if (cancelled) return;

        setTickets(response.tickets);
        setTotal(response.total);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();
    return () => {
      cancelled = true;
    };
  }, [filters, sort, page, pageSize]);

  // Reset the view back to initial load state (page 0, default filters, default sort)
  const handleRefresh = () => {
    setPage(0);
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
  };

  return (
      <ProtectedRoute enabled={AUTH_ENABLED}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <PageHeader
              title="Manage Tickets"
              subtitle="View, filter, and manage all tickets in the system."
          />

          <DashboardTicketsList
              tickets={tickets}
              total={total}
              page={page}
              pageSize={pageSize}
              loading={loading}
              filters={filters}
              sort={sort}
              onFiltersChange={(next) => {
                setPage(0);
                setFilters(next);
              }}
              onSortChange={(next) => {
                setPage(0);
                setSort(next);
              }}
              onPageChange={setPage}
              onRefresh={handleRefresh}
              defaultFilters={DEFAULT_FILTERS}
          />
        </div>
      </ProtectedRoute>
  );
}
