import { Entry } from '@/lib/types';
import { THEME } from '@/lib/theme';
import Link from 'next/link';

interface RecentLogStreamProps {
  entries: Entry[];
  getTicketTitle: (ticketId: string) => string;
  getTicketSlug: (ticketId: string) => string | undefined;
}

export function RecentLogStream({ entries, getTicketTitle, getTicketSlug }: RecentLogStreamProps) {
  return (
    <div>
      <h2
        className="text-xs font-mono uppercase tracking-wider mb-8"
        style={{ color: THEME.colors.text.secondary }}
      >
        RECENT ACTIVITY
      </h2>

      <div className="space-y-8">
        {entries.map((entry, index) => {
          const ticketSlug = getTicketSlug(entry.ticketId);

          const entryContent = (
            <>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
                <span
                  className="text-xs font-mono"
                  style={{ color: THEME.colors.text.muted }}
                >
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: THEME.colors.text.muted }}
                >
                  {getTicketTitle(entry.ticketId)}
                </span>
              </div>

              {entry.title && (
                <h3
                  className="text-base md:text-lg font-mono font-medium mb-2"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {entry.title}
                </h3>
              )}

              {entry.body && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  {entry.body.length > 140
                    ? `${entry.body.substring(0, 140)}...`
                    : entry.body}
                </p>
              )}
            </>
          );

          return (
            <div key={entry.id}>
              {ticketSlug ? (
                <Link href={`/tickets/${ticketSlug}`} className="block mb-4 transition-opacity hover:opacity-80">
                  {entryContent}
                </Link>
              ) : (
                <div className="block mb-4">
                  {entryContent}
                </div>
              )}

              {index < entries.length - 1 && (
              <div
                className="h-px"
                style={{ backgroundColor: THEME.colors.border.hairline }}
              />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
