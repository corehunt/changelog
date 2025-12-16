import { Entry } from '@/lib/types';
import { THEME } from '@/lib/theme';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface EntryTimelineProps {
    entries: Entry[];
    showTicketTitle?: boolean;

    // legacy props (safe to keep for now, but no longer required)
    getTicketTitle?: (ticketId: string) => string;
    getTicketSlug?: (ticketId: string) => string | undefined;
}

export function EntryTimeline({
                                  entries,
                                  showTicketTitle = false,
                                  getTicketTitle,
                                  getTicketSlug,
                              }: EntryTimelineProps) {
    if (entries.length === 0) {
        return (
            <div
                className="text-center py-12"
                style={{ color: THEME.colors.text.muted }}
            >
                No entries yet
            </div>
        );
    }

    return (
        <div className="relative">
            <div
                className="absolute left-0 md:left-0 top-0 bottom-0 w-px"
                style={{ backgroundColor: THEME.colors.border.primary }}
            />

            <div className="space-y-6 md:space-y-8">
                {entries.map((entry, index) => {
                    const ticketSlug = entry.ticketSlug || getTicketSlug?.(entry.ticketSlug);

                    const entryContent = (
                        <>
                            <div className="flex items-start gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={14} style={{ color: THEME.colors.text.muted }} />
                                        <span
                                            className="text-sm font-mono"
                                            style={{ color: THEME.colors.text.secondary }}
                                        >
                      {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                      })}
                    </span>
                                    </div>

                                    {showTicketTitle && (
                                        <div
                                            className="text-xs font-mono mb-2"
                                            style={{ color: THEME.colors.text.muted }}
                                        >
                                            {getTicketTitle ? getTicketTitle(entry.ticketName) : entry.ticketName}
                                        </div>
                                    )}

                                    {entry.title && (
                                        <h3
                                            className="text-base md:text-lg font-mono font-semibold mb-2"
                                            style={{ color: THEME.colors.text.primary }}
                                        >
                                            {entry.title}
                                        </h3>
                                    )}
                                </div>
                            </div>

                            {entry.body && (
                                <p
                                    className="text-sm leading-relaxed mb-4"
                                    style={{ color: THEME.colors.text.secondary }}
                                >
                                    {entry.body}
                                </p>
                            )}

                            {entry.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {entry.technologies.map((tech) => (
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
                            )}
                        </>
                    );

                    return (
                        <div key={entry.id} className="relative pl-6 md:pl-8">
                            <div
                                className="absolute left-0 w-2 h-2 rounded-full -translate-x-[3.5px] top-1/2 -translate-y-1/2"
                                style={{
                                    backgroundColor: THEME.colors.accent.primary,
                                }}
                            />

                            {ticketSlug ? (
                                <Link
                                    href={`/tickets/${ticketSlug}`}
                                    className="block p-4 md:p-5 transition-colors hover:bg-opacity-80"
                                    style={{
                                        backgroundColor: THEME.colors.surface.secondary,
                                        borderRadius: THEME.borderRadius.card,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {entryContent}
                                </Link>
                            ) : (
                                <div
                                    className="block p-4 md:p-5"
                                    style={{
                                        backgroundColor: THEME.colors.surface.secondary,
                                        borderRadius: THEME.borderRadius.card,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {entryContent}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
