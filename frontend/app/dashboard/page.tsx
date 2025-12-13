// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { AdminMetricsRow } from '@/components/AdminMetricsRow';
import { AdminQuickActions } from '@/components/AdminQuickActions';
import { ActiveTicketsPanel } from '@/components/ActiveTicketsPanel';
import { DashboardTicketsList } from '@/components/DashboardTicketsList';
import { getTickets, TicketFilters, TicketSort } from '@/lib/api/tickets';
import { getEntries } from '@/lib/api/entries';
import { Ticket } from '@/lib/types';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AUTH_ENABLED } from '@/lib/auth/config';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [entriesThisWeek, setEntriesThisWeek] = useState(0);

  const [filters, setFilters] = useState<TicketFilters>({
    statusNot: 'ACTIVE',
  });
  const [sort, setSort] = useState<TicketSort>({
    field: 'start_date',
    direction: 'desc',
  });

  useEffect(() => {
    loadTickets();
    loadMetrics();
    loadActiveTickets();
  }, [filters, sort, page]);

  async function loadTickets() {
    try {
      setLoading(true);
      const response = await getTickets(filters, sort, { page, pageSize });
      setTickets(response.tickets);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadActiveTickets() {
    try {
      const response = await getTickets(
          { status: 'ACTIVE' },
          { field: 'start_date', direction: 'desc' },
          { page: 1, pageSize: 10 }
      );
      setActiveTickets(response.tickets);
    } catch (error) {
      console.error('Error loading active tickets:', error);
    }
  }

  async function loadMetrics() {
    try {
      const [activeResponse, completedResponse, entriesResponse] = await Promise.all([
        getTickets({ status: 'ACTIVE' }, undefined, { page: 1, pageSize: 1 }),
        getTickets({ status: 'COMPLETED' }, undefined, { page: 1, pageSize: 1 }),
        getEntries(
            {
              dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            undefined,
            { page: 1, pageSize: 1 }
        ),
      ]);

      setActiveCount(activeResponse.total);
      setCompletedCount(completedResponse.total);
      setEntriesThisWeek(entriesResponse.total);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }

  const metrics = [
    { label: 'Active tickets', value: activeCount },
    { label: 'Completed', value: completedCount },
    { label: 'Entries this week', value: entriesThisWeek },
  ];

  const handleRefresh = () => {
    loadTickets();
    loadMetrics();
    loadActiveTickets();
  };

  return (
      <ProtectedRoute enabled={AUTH_ENABLED}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <PageHeader
              title="Admin Console"
              subtitle="Internal view of tickets, entries, and recent activity."
          />

          <AdminMetricsRow metrics={metrics} />

          <AdminQuickActions />

          {activeTickets.length > 0 && (
              <div className="mb-16">
                <ActiveTicketsPanel tickets={activeTickets} showManageButton={true} />
              </div>
          )}

          <DashboardTicketsList
              tickets={tickets}
              total={total}
              page={page}
              pageSize={pageSize}
              loading={loading}
              filters={filters}
              sort={sort}
              onFiltersChange={setFilters}
              onSortChange={setSort}
              onPageChange={setPage}
              onRefresh={handleRefresh}
              defaultFilters={{ statusNot: 'ACTIVE' }}
          />
        </div>
      </ProtectedRoute>
  );
}
