import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TicketMetaPanel } from '@/components/TicketMetaPanel';
import { SectionCard } from '@/components/SectionCard';
import { EntryTimeline } from '@/components/EntryTimeline';
import { PageHeader } from '@/components/PageHeader';
import { THEME } from '@/lib/theme';
import { Ticket, Entry } from '@/lib/types';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

async function getTicketBySlug(slug: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    background: data.background,
    technologies: data.technologies,
    isPublic: data.is_public,
    learned: data.learned,
    roadblocksSummary: data.roadblocks_summary,
    metricsSummary: data.metrics_summary,
  };
}

async function getEntries(ticketId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('date', { ascending: true });

  if (error || !data) return [];

  return data.map((entry) => ({
    id: entry.id,
    ticketId: entry.ticket_id,
    date: entry.date,
    title: entry.title,
    body: entry.body,
    technologies: entry.technologies,
    isPublic: entry.is_public,
  }));
}

export default async function TicketDetailPage({ params }: PageProps) {
  const ticket = await getTicketBySlug(params.slug);

  if (!ticket) {
    notFound();
  }

  const entries = await getEntries(ticket.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <PageHeader title={ticket.title} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <TicketMetaPanel ticket={ticket} />

          {(ticket.learned || ticket.roadblocksSummary || ticket.metricsSummary) && (
            <SectionCard title="Postmortem">
              <div className="space-y-6">
                {ticket.learned && (
                  <div>
                    <h3
                      className="text-lg font-mono font-semibold mb-3"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      What I Learned
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: THEME.colors.text.secondary }}
                    >
                      {ticket.learned}
                    </p>
                  </div>
                )}

                {ticket.roadblocksSummary && (
                  <div>
                    <h3
                      className="text-lg font-mono font-semibold mb-3"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      Roadblocks
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: THEME.colors.text.secondary }}
                    >
                      {ticket.roadblocksSummary}
                    </p>
                  </div>
                )}

                {ticket.metricsSummary && (
                  <div>
                    <h3
                      className="text-lg font-mono font-semibold mb-3"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      Metrics & Impact
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: THEME.colors.text.secondary }}
                    >
                      {ticket.metricsSummary}
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          {ticket.background && (
            <SectionCard title="Background">
              <p
                className="text-base leading-relaxed"
                style={{ color: THEME.colors.text.secondary }}
              >
                {ticket.background}
              </p>
            </SectionCard>
          )}

          <SectionCard title="Daily Timeline">
            <EntryTimeline entries={entries} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
