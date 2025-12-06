import { Ticket } from '@/lib/types';
import { THEME } from '@/lib/theme';
import { Calendar, Cpu } from 'lucide-react';

interface TicketMetaPanelProps {
  ticket: Ticket;
}

export function TicketMetaPanel({ ticket }: TicketMetaPanelProps) {
  const statusColor = ticket.status === 'ACTIVE'
    ? THEME.colors.status.active
    : THEME.colors.status.completed;

  return (
    <div
      className="p-4 md:p-6"
      style={{
        backgroundColor: THEME.colors.surface.primary,
        borderRadius: THEME.borderRadius.card,
        border: `1px solid ${THEME.colors.border.subtle}`,
      }}
    >
      <div className="space-y-6">
        <div>
          <h3
            className="text-sm font-mono font-medium mb-2"
            style={{ color: THEME.colors.text.muted }}
          >
            STATUS
          </h3>
          <span
            className="inline-block px-3 py-1 text-xs font-mono font-medium"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
              borderRadius: THEME.borderRadius.pill,
            }}
          >
            {ticket.status}
          </span>
        </div>

        <div>
          <h3
            className="text-sm font-mono font-medium mb-3"
            style={{ color: THEME.colors.text.muted }}
          >
            TIMELINE
          </h3>
          <div className="flex items-start gap-2 mb-2">
            <Calendar size={16} style={{ color: THEME.colors.text.secondary, marginTop: '2px' }} />
            <div>
              <div
                className="text-sm font-mono"
                style={{ color: THEME.colors.text.secondary }}
              >
                Started: {new Date(ticket.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              {ticket.endDate && (
                <div
                  className="text-sm font-mono mt-1"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Ended: {new Date(ticket.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-mono font-medium mb-3 flex items-center gap-2"
            style={{ color: THEME.colors.text.muted }}
          >
            <Cpu size={16} />
            TECHNOLOGIES
          </h3>
          <div className="flex flex-wrap gap-2">
            {ticket.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono"
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  color: THEME.colors.text.secondary,
                  borderRadius: THEME.borderRadius.input,
                  border: `1px solid ${THEME.colors.border.subtle}`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
