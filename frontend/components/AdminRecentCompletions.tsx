'use client';

import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';

interface AdminRecentCompletionsProps {
  tickets: Ticket[];
}

export function AdminRecentCompletions({ tickets }: AdminRecentCompletionsProps) {
  return (
    <div className="mb-12">
      <h3
        className="text-xs font-mono uppercase tracking-wider mb-6"
        style={{ color: THEME.colors.text.secondary }}
      >
        Recent completions
      </h3>
      <div className="space-y-0">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="py-4"
            style={{
              borderTop: index === 0 ? `1px solid ${THEME.colors.border.hairline}` : 'none',
              borderBottom: `1px solid ${THEME.colors.border.hairline}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link
                  href={`/tickets/${ticket.slug}`}
                  className="font-mono text-sm mb-2 block transition-colors"
                  style={{ color: THEME.colors.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = THEME.colors.text.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = THEME.colors.text.primary;
                  }}
                >
                  {ticket.title}
                </Link>
                {ticket.metricsSummary && (
                  <div
                    className="text-xs font-mono leading-relaxed mb-2"
                    style={{ color: THEME.colors.text.muted }}
                  >
                    {ticket.metricsSummary}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {ticket.endDate && (
                  <div
                    className="text-xs font-mono"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    {format(new Date(ticket.endDate), 'MMM d, yyyy')}
                  </div>
                )}
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
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div
            className="py-8 text-center text-sm font-mono"
            style={{ color: THEME.colors.text.muted }}
          >
            No completed tickets
          </div>
        )}
      </div>
    </div>
  );
}
