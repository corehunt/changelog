import { SystemStatusPanel } from '@/components/SystemStatusPanel';
import { ActiveTicketsPanel } from '@/components/ActiveTicketsPanel';
import { RecentLogStream } from '@/components/RecentLogStream';
import { PageHeader } from '@/components/PageHeader';
import { THEME } from '@/lib/theme';

import { getDashboardHome } from '@/lib/api/dashboard';
import type { Ticket, Entry } from '@/lib/types';

export default async function Home() {
  const dashboard = await getDashboardHome();

  // --- Tickets ---
  const activeTickets: Ticket[] = dashboard.activeTickets.map((t) => ({
    id: String(t.id),
    slug: t.slug,
    title: t.title,
    status: t.status,
    startDate: t.startDate,
    endDate: t.endDate ?? undefined,
    technologies: t.technologies,
    isPublic: true, // dashboard summaries don’t include this yet
  }));

  // Only the length is used by SystemStatusPanel
  const completedTicketsCount = dashboard.metrics.completedTickets;

  // --- Entries ---
  const recentEntries: Entry[] = dashboard.recentEntries.map((e) => ({
    id: String(e.entryId),
    ticketName: e.ticketName,
    ticketSlug: e.ticketSlug,
    date: e.date,
    title: e.title ?? undefined,
    body: e.body ?? undefined,
    technologies: e.technologies,
    isPublic: e.visibility === 'Public',
  }));

  // --- Metrics ---
  const logsThisWeek = dashboard.metrics.logsThisWeek;

  const lastUpdate = dashboard.metrics.lastUpdate
      ? new Date(dashboard.metrics.lastUpdate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      : 'No entries';

  const ticketByTitle = new Map(activeTickets.map((t) => [t.title, t]));

  const getTicketTitle = (ticketId: string) => {
    return ticketByTitle.get(ticketId)?.title ?? ticketId ?? 'Unknown';
  };

  const getTicketSlug = (ticketId: string) => {
    return ticketByTitle.get(ticketId)?.slug;
  };

  return (
      <div>
        <div className="min-h-screen flex flex-col justify-start max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16">
          <div className="py-12">
            <PageHeader
                title="Ticket Dashboard"
                subtitle="A chronicle of engineering work, technical decisions, and their outcomes."
            />
            <div
                className="h-px max-w-xs mt-4"
                style={{ backgroundColor: THEME.colors.accent.primary }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4">
              <SystemStatusPanel
                  activeTickets={activeTickets.length}
                  completedTickets={completedTicketsCount}
                  logsThisWeek={logsThisWeek}
                  lastUpdate={lastUpdate}
              />
            </div>

            <div className="lg:col-span-8 space-y-16">
              <ActiveTicketsPanel tickets={activeTickets} />
              <RecentLogStream
                  entries={recentEntries}
                  getTicketTitle={getTicketTitle}
                  getTicketSlug={getTicketSlug}
              />
            </div>
          </div>
        </div>
      </div>
  );
}