'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { EntryTimeline } from '@/components/EntryTimeline';
import { getEntries } from '@/lib/api/entries';
import { getTicketById } from '@/lib/api/tickets';
import { Entry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { THEME } from '@/lib/theme';

export default function TimelinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [ticketCache, setTicketCache] = useState<Map<string, { title: string; slug: string }>>(new Map());

  useEffect(() => {
    loadEntries();
  }, [page]);

  async function loadEntries() {
    try {
      setLoading(true);
      const response = await getEntries(
        {},
        { field: 'date', direction: 'desc' },
        { page, pageSize }
      );
      setEntries(response.entries);
      setTotal(response.total);

      const uniqueTicketIds = Array.from(new Set(response.entries.map(e => e.ticketId)));
      const newCache = new Map(ticketCache);

      for (const ticketId of uniqueTicketIds) {
        if (!newCache.has(ticketId)) {
          try {
            const ticket = await getTicketById(ticketId);
            if (ticket) {
              newCache.set(ticketId, { title: ticket.title, slug: ticket.slug });
            }
          } catch (error) {
            console.error(`Error loading ticket ${ticketId}:`, error);
          }
        }
      }

      setTicketCache(newCache);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }

  const getTicketTitle = (ticketId: string) => {
    return ticketCache.get(ticketId)?.title || 'Unknown Ticket';
  };

  const getTicketSlug = (ticketId: string) => {
    return ticketCache.get(ticketId)?.slug;
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <PageHeader
        title="Timeline"
        subtitle="Chronological view of all work entries"
      />

      {loading ? (
        <div
          className="py-12 text-center text-sm"
          style={{ color: THEME.colors.text.muted }}
        >
          Loading...
        </div>
      ) : (
        <EntryTimeline
          entries={entries}
          showTicketTitle={true}
          getTicketTitle={getTicketTitle}
          getTicketSlug={getTicketSlug}
        />
      )}

      {totalPages > 1 && (
        <div
          className="mt-8 flex items-center justify-between"
          style={{
            paddingTop: '1.5rem',
            borderTop: `1px solid ${THEME.colors.border.hairline}`,
          }}
        >
          <div
            className="text-xs font-mono"
            style={{ color: THEME.colors.text.secondary }}
          >
            Page {page} of {totalPages} ({total} total entries)
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
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
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || loading}
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
