// app/dashboard/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { AdminMetricsRow } from '@/components/AdminMetricsRow';
import { AdminQuickActions } from '@/components/AdminQuickActions';
import { ActiveTicketsPanel } from '@/components/ActiveTicketsPanel';
import { DashboardTicketsList } from '@/components/DashboardTicketsList';
import { getTickets, TicketFilters, TicketSort } from '@/lib/api/tickets';
import { getDashboardHome } from '@/lib/api/dashboard';
import { Ticket } from '@/lib/types';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AUTH_ENABLED } from '@/lib/auth/config';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<TicketFilters>({});
  const [sort, setSort] = useState<TicketSort>({
    field: 'start_date',
    direction: 'desc',
  });

  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [entriesThisWeek, setEntriesThisWeek] = useState(0);

  const ticketsRequestSeq = useRef(0);
  const dashboardRequestSeq = useRef(0);

  useEffect(() => {
    void loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  useEffect(() => {
    void loadDashboardSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTickets() {
    const seq = ++ticketsRequestSeq.current;

    try {
      setLoading(true);
      const response = await getTickets(filters, sort, { page, pageSize });

      if (seq !== ticketsRequestSeq.current) return;

      setTickets(response.tickets);
      setTotal(response.total);
    } catch (error) {
      if (seq !== ticketsRequestSeq.current) return;
      console.error('Error loading tickets:', error);
    } finally {
      if (seq !== ticketsRequestSeq.current) return;
      setLoading(false);
    }
  }

  async function loadDashboardSummary() {
    const seq = ++dashboardRequestSeq.current;

    try {
      const dashboard = await getDashboardHome();
      if (seq !== dashboardRequestSeq.current) return;

      setActiveTickets(dashboard.activeTickets ?? []);
      setActiveCount(dashboard.metrics?.activeTickets ?? 0);
      setCompletedCount(dashboard.metrics?.completedTickets ?? 0);
      setEntriesThisWeek(dashboard.metrics?.logsThisWeek ?? 0);
    } catch (error) {
      if (seq !== dashboardRequestSeq.current) return;
      console.error('Error loading dashboard summary:', error);
    }
  }

  const metrics = [
    { label: 'Active tickets', value: activeCount },
    { label: 'Completed', value: completedCount },
    { label: 'Entries this week', value: entriesThisWeek },
  ];

  const handleRefresh = () => {
    void loadTickets();
    void loadDashboardSummary();
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
              defaultFilters={{}}
          />
        </div>
      </ProtectedRoute>
  );
}
