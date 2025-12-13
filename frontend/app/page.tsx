import { SystemStatusPanel } from '@/components/SystemStatusPanel';
import { ActiveTicketsPanel } from '@/components/ActiveTicketsPanel';
import { RecentLogStream } from '@/components/RecentLogStream';
import { PageHeader } from '@/components/PageHeader';
import { mockTickets, mockEntries, getTicketById } from '@/lib/mockData';
import { THEME } from '@/lib/theme';

export default function Home() {
  const activeTickets = mockTickets.filter(t => t.status === 'ACTIVE');
  const completedTickets = mockTickets.filter(t => t.status === 'COMPLETED');

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const logsThisWeek = mockEntries.filter(
      e => new Date(e.date) >= oneWeekAgo
  ).length;

  const sortedEntries = [...mockEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastUpdate = sortedEntries.length > 0
      ? new Date(sortedEntries[0].date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      : 'No entries';

  const recentEntries = sortedEntries.slice(0, 5);

  const getTicketTitle = (ticketId: string) => {
    const ticket = getTicketById(ticketId);
    return ticket ? ticket.title : 'Unknown';
  };

  const getTicketSlug = (ticketId: string) => {
    const ticket = getTicketById(ticketId);
    return ticket?.slug;
  };

  return (
      <div>
        <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16">
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
                  completedTickets={completedTickets.length}
                  logsThisWeek={logsThisWeek}
                  lastUpdate={lastUpdate}
              />
            </div>

            <div className="lg:col-span-8 space-y-16">
              <ActiveTicketsPanel tickets={activeTickets} />
              <RecentLogStream entries={recentEntries} getTicketTitle={getTicketTitle} getTicketSlug={getTicketSlug} />
            </div>
          </div>
        </div>
      </div>
  );
}