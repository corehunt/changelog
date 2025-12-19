import Link from 'next/link';
import { Ticket } from '@/lib/types';
import { THEME } from '@/lib/theme';
import { Edit3 } from 'lucide-react';

interface ActiveTicketsPanelProps {
  tickets: Ticket[];
  showManageButton?: boolean;
}

function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export function ActiveTicketsPanel({ tickets, showManageButton = false }: ActiveTicketsPanelProps) {
  return (
    <div>
      <h2
        className="text-xs font-mono uppercase tracking-wider mb-8"
        style={{ color: THEME.colors.text.secondary }}
      >
        ACTIVE WORK
      </h2>

      <div className="space-y-8">
        {tickets.map((ticket, index) => (
          <div key={ticket.id}>
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: THEME.colors.accent.primary }}
                />
                <div className="flex-1">
                  <Link
                    href={`/tickets/${ticket.slug}`}
                    className="group"
                  >
                    <h3
                      className="text-lg md:text-xl font-mono font-medium transition-colors group-hover:opacity-70"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      {ticket.title}
                    </h3>
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    {/*<span*/}
                    {/*  className="text-xs font-mono"*/}
                    {/*  style={{ color: THEME.colors.text.muted }}*/}
                    {/*>*/}
                    {/*  {getDaysAgo(ticket.startDate)}*/}
                    {/*</span>*/}
                    <span
                      className="text-xs font-mono"
                      style={{ color: THEME.colors.text.secondary }}
                    >
                      {ticket.technologies.slice(0, 3).join(', ')}
                      {ticket.technologies.length > 3 && ` +${ticket.technologies.length - 3}`}
                    </span>
                  </div>
                </div>
                {showManageButton && (
                  <Link
                    href={`/admin/tickets/${ticket.slug}/entries`}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono transition-opacity hover:opacity-70"
                    style={{
                      backgroundColor: THEME.colors.surface.elevated,
                      color: THEME.colors.text.secondary,
                      border: `1px solid ${THEME.colors.border.subtle}`,
                    }}
                  >
                    <Edit3 size={12} />
                    Manage entries
                  </Link>
                )}
              </div>
            </div>
            {index < tickets.length - 1 && (
              <div
                className="h-px mt-8"
                style={{ backgroundColor: THEME.colors.border.hairline }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
