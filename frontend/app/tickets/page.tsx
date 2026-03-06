import { SystemStatusPanel } from '@/components/SystemStatusPanel';
import { ActiveTicketsPanel } from '@/components/ActiveTicketsPanel';
import { RecentLogStream } from '@/components/RecentLogStream';
import { PageHeader } from '@/components/PageHeader';

import { getDashboardHome } from '@/lib/api/dashboard';
import type { Ticket, Entry } from '@/lib/types';

function toLocalDateOnly(dateStr: string): Date {
    // Supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..." by stripping time.
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatDateOnlyForDisplay(dateStr?: string | null): string {
    if (!dateStr) return 'No entries';
    return toLocalDateOnly(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export const dynamic = "force-dynamic";

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
        isPublic: true,
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

    const lastUpdate = formatDateOnlyForDisplay(dashboard.metrics.lastUpdate);

    const ticketBySlug = new Map(activeTickets.map((t) => [t.slug, t]));

    const getTicketTitle = (ticketSlug: string) => {
        return ticketBySlug.get(ticketSlug)?.title ?? ticketSlug ?? 'Unknown';
    };

    const getTicketSlug = (ticketSlug: string) => {
        return ticketBySlug.get(ticketSlug)?.slug;
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <PageHeader
                    title="Ticket Dashboard"
                    subtitle="Current and recent work"
                />

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