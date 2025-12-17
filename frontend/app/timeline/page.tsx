'use client';

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TicketTimeline } from "@/components/TicketTimeline";
import { getTicketsPage } from "@/lib/api/tickets";
import type { Ticket } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { THEME } from "@/lib/theme";

export default function TimelinePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await getTicketsPage({ page, size: pageSize });

        if (cancelled) return;

        setTickets(res.tickets);
        setTotalElements(res.totalElements);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error("Error loading tickets:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const canGoPrev = page > 0 && !loading;
  const canGoNext = page + 1 < totalPages && !loading;

  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <PageHeader title="Timeline" subtitle="Chronological view of shipped and active work" />

        {loading ? (
            <div className="py-12 text-center text-sm" style={{ color: THEME.colors.text.muted }}>
              Loading...
            </div>
        ) : (
            <TicketTimeline tickets={tickets} />
        )}

        {totalPages > 1 && (
            <div
                className="mt-8 flex items-center justify-between"
                style={{
                  paddingTop: "1.5rem",
                  borderTop: `1px solid ${THEME.colors.border.hairline}`,
                }}
            >
              <div className="text-xs font-mono" style={{ color: THEME.colors.text.secondary }}>
                page={page} tickets={totalElements}
              </div>

              <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={!canGoPrev}
                    style={{
                      borderColor: THEME.colors.border.subtle,
                      color: THEME.colors.text.secondary,
                    }}
                >
                  <ChevronLeft size={14} />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!canGoNext}
                    style={{
                      borderColor: THEME.colors.border.subtle,
                      color: THEME.colors.text.secondary,
                    }}
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
        )}
      </div>
  );
}
