import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { TicketForm } from '@/components/TicketForm';
import { THEME } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';
import { AdminProtectedLayout } from '@/components/AdminProtectedLayout';
import { getTicketDetailBySlug } from '@/lib/api/tickets';

export const dynamic = 'force-dynamic';

export default async function ManageTicketPage({params}: { params: { slug: string } }) {
    const ticket = await getTicketDetailBySlug(params.slug);

    if (!ticket) {
        return (
            <AdminProtectedLayout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <PageHeader
                        title="Ticket not found"
                        subtitle="The ticket you're looking for doesn't exist."
                    />
                    <Link
                        href="/admin/tickets"
                        className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:opacity-70"
                        style={{color: THEME.colors.text.secondary}}
                    >
                        <ArrowLeft size={14}/>
                        Back to manage tickets
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
                        href="/admin/tickets"
                        className="inline-flex items-center gap-2 text-sm font-mono mb-6 transition-colors hover:opacity-70"
                        style={{color: THEME.colors.text.secondary}}
                    >
                        <ArrowLeft size={14}/>
                        Back to manage tickets
                    </Link>

                    <PageHeader title="Manage Ticket" subtitle={`Editing ${ticket.title}`}/>
                </div>

                <div className="space-y-6">
                    <SectionCard>
                        <TicketForm ticket={ticket}/>
                    </SectionCard>

                    <div className="flex gap-4 justify-between">
                        <Link
                            href={`/admin/tickets/${ticket.slug}/entries`}
                            className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
                            style={{
                                color: THEME.colors.text.secondary,
                                borderBottom: `1px solid ${THEME.colors.border.hairline}`,
                            }}
                        >
                            Manage entries
                        </Link>

                    </div>
                </div>
            </div>
        </AdminProtectedLayout>
    );
}
