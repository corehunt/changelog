import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { TicketForm } from '@/components/TicketForm';
import { THEME } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';
import { AdminProtectedLayout } from '@/components/AdminProtectedLayout';

export default function NewTicketPage() {
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

            <PageHeader title="Create New Ticket" subtitle="Start tracking a new project or task" />
          </div>

          <div className="space-y-6">
            <SectionCard>
              <TicketForm />
            </SectionCard>

            <div className="flex justify-end">
              <Link
                  href="/dashboard"
                  className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
                  style={{ color: THEME.colors.text.secondary }}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </AdminProtectedLayout>
  );
}
