import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { TicketForm } from '@/components/TicketForm';
import { supabase } from '@/lib/supabase';
import { THEME } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';
import { Ticket } from '@/lib/types';
import { AdminProtectedLayout } from '@/components/AdminProtectedLayout';

export const dynamic = 'force-dynamic';

async function getTicket(id: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
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

export default async function ManageTicketPage({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    return (
      <AdminProtectedLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <PageHeader
            title="Ticket not found"
            subtitle="The ticket you're looking for doesn't exist."
          />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:opacity-70"
            style={{ color: THEME.colors.text.secondary }}
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
        </div>
      </AdminProtectedLayout>
    );
  }

  return (
    <AdminProtectedLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-mono mb-6 transition-colors hover:opacity-70"
            style={{ color: THEME.colors.text.secondary }}
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
          <PageHeader
            title="Manage Ticket"
            subtitle={`Editing ${ticket.title}`}
          />
        </div>

        <div className="space-y-6">
          <SectionCard>
            <TicketForm ticket={ticket} />
          </SectionCard>

          <div className="flex gap-4 justify-between">
            <Link
              href={`/admin/tickets/${ticket.id}/entries`}
              className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
              style={{
                color: THEME.colors.text.secondary,
                borderBottom: `1px solid ${THEME.colors.border.hairline}`,
              }}
            >
              Manage entries
            </Link>

            <button
              className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
              style={{
                backgroundColor: THEME.colors.surface.elevated,
                color: THEME.colors.text.primary,
                border: `1px solid ${THEME.colors.border.subtle}`,
              }}
            >
              Save changes (mock)
            </button>
          </div>
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
