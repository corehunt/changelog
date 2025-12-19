import {Entry} from '@/lib/types';
import {THEME} from '@/lib/theme';
import Link from 'next/link';

interface RecentLogStreamProps {
    entries: Entry[];
    getTicketTitle: (ticketId: string) => string;
    getTicketSlug: (ticketId: string) => string | undefined;
}

function toLocalDateOnly(dateStr: string): Date {
    // Supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..." by stripping time.
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatEntryDate(dateStr: string): string {
    return toLocalDateOnly(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function RecentLogStream({entries, getTicketTitle, getTicketSlug}: RecentLogStreamProps) {
    return (
        <div>
            <h2
                className="text-xs font-mono uppercase tracking-wider mb-8"
                style={{color: THEME.colors.text.secondary}}
            >
                RECENT ACTIVITY
            </h2>

            <div className="space-y-8">
                {entries.map((entry, index) => {
                    const ticketSlug = entry.ticketSlug;

                    const entryContent = (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
                                <span className="text-xs font-mono" style={{color: THEME.colors.text.muted}}>
                                  {formatEntryDate(entry.date)} - {entry.ticketName}
                                </span>
                            </div>

                            {entry.title && (
                                <h3
                                    className="text-base md:text-lg font-mono font-medium mb-2"
                                    style={{color: THEME.colors.text.primary}}
                                >
                                    {entry.title}
                                </h3>
                            )}

                            {entry.body && (
                                <p className="text-sm leading-relaxed" style={{color: THEME.colors.text.secondary}}>
                                    {entry.body.length > 140 ? `${entry.body.substring(0, 140)}...` : entry.body}
                                </p>
                            )}
                        </>
                    );

                    return (
                        <div key={entry.id}>
                            {ticketSlug ? (
                                <Link
                                    href={`/tickets/${ticketSlug}`}
                                    className="block mb-4 transition-opacity hover:opacity-80"
                                >
                                    {entryContent}
                                </Link>
                            ) : (
                                <div className="block mb-4">{entryContent}</div>
                            )}

                            {index < entries.length - 1 && (
                                <div className="h-px" style={{backgroundColor: THEME.colors.border.hairline}}/>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
