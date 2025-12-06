'use client';

import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';

interface AdminActiveTicketsListProps {
  tickets: Ticket[];
}

export function AdminActiveTicketsList({ tickets }: AdminActiveTicketsListProps) {
  return (
    <div className="mb-12">
      <h3
        className="text-xs font-mono uppercase tracking-wider mb-6"
        style={{ color: THEME.colors.text.secondary }}
      >
        Active tickets
      </h3>
      <div className="space-y-0">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
            style={{
              borderTop: index === 0 ? `1px solid ${THEME.colors.border.hairline}` : 'none',
              borderBottom: `1px solid ${THEME.colors.border.hairline}`,
            }}
          >
            <div className="md:col-span-4">
              <div
                className="font-mono text-sm mb-1"
                style={{ color: THEME.colors.text.primary }}
              >
                {ticket.title}
              </div>
              <div
                className="text-xs font-mono"
                style={{ color: THEME.colors.text.muted }}
              >
                {ticket.slug}
              </div>
            </div>

            <div className="md:col-span-2">
              <div
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                {ticket.status}
              </div>
            </div>

            <div className="md:col-span-2">
              <div
                className="text-xs font-mono"
                style={{ color: THEME.colors.text.secondary }}
              >
                {format(new Date(ticket.startDate), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="md:col-span-2">
              <div
                className="text-xs font-mono"
                style={{ color: THEME.colors.text.muted }}
              >
                {ticket.isPublic ? 'Public' : 'Private'}
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Link
                href={`/tickets/${ticket.slug}`}
                className="text-xs font-mono transition-colors"
                style={{ color: THEME.colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.secondary;
                }}
              >
                open
              </Link>
              <Link
                href={`/admin/tickets/${ticket.id}`}
                className="text-xs font-mono transition-colors"
                style={{ color: THEME.colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.secondary;
                }}
              >
                manage
              </Link>
              <Link
                href={`/admin/tickets/${ticket.id}/entries`}
                className="text-xs font-mono transition-colors"
                style={{ color: THEME.colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = THEME.colors.text.secondary;
                }}
              >
                entries
              </Link>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div
            className="py-8 text-center text-sm font-mono"
            style={{ color: THEME.colors.text.muted }}
          >
            No active tickets
          </div>
        )}
      </div>
    </div>
  );
}
