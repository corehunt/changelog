import { Ticket } from '@/lib/types';
import { THEME } from '@/lib/theme';
import {Calendar, Cpu, Activity} from 'lucide-react';

interface TicketMetaPanelProps {
  ticket: Ticket;
}

function toLocalDateOnly(dateStr: string): Date {
  // Supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..." by stripping time.
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatEntryDate(dateStr: string): string {
  const d = toLocalDateOnly(dateStr);
  return d.toISOString().slice(0, 10);
}

export function TicketMetaPanel({ ticket }: TicketMetaPanelProps) {
  const statusColor =
      ticket.status === 'ACTIVE'
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
          {/* STATUS */}
          <div>
            <h3
                className="text-sm font-mono font-medium mb-2 flex items-center gap-2"
                style={{ color: THEME.colors.text.muted }}
            >
              <Activity size={16} />
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


          {/* TIMELINE */}
          <div>
            <h3
                className="text-sm font-mono font-medium mb-3 flex items-center gap-2"
                style={{ color: THEME.colors.text.muted }}
            >
              <Calendar size={16} />
              TIMELINE
            </h3>

            <div className="space-y-1">
              <div
                  className="text-sm font-mono"
                  style={{ color: THEME.colors.text.secondary }}
              >
                Started: {formatEntryDate(ticket.startDate)}
              </div>

              {ticket.endDate && (
                  <div
                      className="text-sm font-mono"
                      style={{ color: THEME.colors.text.secondary }}
                  >
                    Completed: {formatEntryDate(ticket.endDate)}
                  </div>
              )}
            </div>
          </div>


          {/* TECHNOLOGIES */}
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
