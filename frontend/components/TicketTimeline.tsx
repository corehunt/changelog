import type { Ticket } from "@/lib/types";
import { THEME } from "@/lib/theme";
import { Calendar, CheckCircle2, CircleDot } from "lucide-react";
import Link from "next/link";

interface TicketTimelineProps {
    tickets: Ticket[];
}

/**
 * Status color rules:
 * - ACTIVE     → existing accent color
 * - COMPLETED  → navy blue
 */
function getStatusColor(status: Ticket["status"]) {
    if (status === "ACTIVE") {
        return THEME.colors.accent.primary;
    }
    return THEME.colors.status.completed;
}

export function TicketTimeline({ tickets }: TicketTimelineProps) {
    if (tickets.length === 0) {
        return (
            <div
                className="text-center py-12"
                style={{ color: THEME.colors.text.muted }}
            >
                No tickets yet
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline rail */}
            <div
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{ backgroundColor: THEME.colors.border.primary }}
            />

            <div className="space-y-6 md:space-y-8">
                {tickets.map((ticket) => {
                    const isActive = ticket.status === "ACTIVE";
                    const statusColor = getStatusColor(ticket.status);

                    const primaryDate =
                        !isActive && ticket.endDate ? ticket.endDate : ticket.startDate;

                    const dateLabel =
                        !isActive && ticket.endDate ? "Completed" : "Started";

                    return (
                        <div key={ticket.id} className="relative pl-6 md:pl-8">
                            {/* Timeline dot — status colored */}
                            <div
                                className="absolute left-0 w-2 h-2 rounded-full -translate-x-[3.5px] top-1/2 -translate-y-1/2"
                                style={{ backgroundColor: statusColor }}
                            />

                            <Link
                                href={`/tickets/${ticket.slug}`}
                                className="block p-4 md:p-5 transition-colors hover:bg-opacity-80"
                                style={{
                                    backgroundColor: THEME.colors.surface.secondary,
                                    borderRadius: THEME.borderRadius.card,
                                    border: `1px solid ${THEME.colors.border.subtle}`,
                                }}
                            >
                                {/* Header row */}
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar size={14} style={{ color: THEME.colors.text.muted }} />

                                    <span
                                        className="text-sm font-mono"
                                        style={{ color: THEME.colors.text.secondary }}
                                    >
                    {dateLabel}:{" "}
                                        {new Date(primaryDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                  </span>

                                    {/* Neutral badge, colored text + icon */}
                                    <span
                                        className="ml-auto inline-flex items-center gap-2 px-2 py-1 text-xs font-mono"
                                        style={{
                                            backgroundColor: "transparent",
                                            color: statusColor,
                                            borderRadius: THEME.borderRadius.input,
                                            border: `1px solid ${THEME.colors.border.subtle}`,
                                        }}
                                    >
                    {isActive ? (
                        <CircleDot size={14} />
                    ) : (
                        <CheckCircle2 size={14} />
                    )}
                                        {ticket.status}
                  </span>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-base md:text-lg font-mono font-semibold mb-2"
                                    style={{ color: THEME.colors.text.primary }}
                                >
                                    {ticket.title}
                                </h3>

                                {/* Date range */}
                                <div
                                    className="text-xs font-mono mb-3"
                                    style={{ color: THEME.colors.text.muted }}
                                >
                                    {new Date(ticket.startDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    {ticket.endDate
                                        ? ` → ${new Date(ticket.endDate).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}`
                                        : " → Present"}
                                </div>

                                {/* Technologies */}
                                {ticket.technologies?.length > 0 && (
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
                                )}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
