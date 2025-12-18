// lib/api/entries.ts
import { authedGet } from "../http";
import type { Entry } from "../types";

export type EntrySummaryResponse = {
  entryId: number;
  ticketName: string;
  ticketSlug: string;
  title: string | null;
  body: string | null;
  technologies: string[];
  date: string;
  visibility: string;
};

export type EntriesPageResponse = {
  entries: EntrySummaryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function isPublicFromVisibility(visibility?: string): boolean {
  return String(visibility ?? "").toUpperCase() === "PUBLIC";
}

function mapSummaryToEntry(e: EntrySummaryResponse): Entry {
  return {
    id: String(e.entryId),
    ticketName: e.ticketName,
    ticketSlug: e.ticketSlug,
    date: e.date,
    title: e.title ?? undefined,
    body: e.body ?? undefined,
    technologies: e.technologies ?? [],
    isPublic: isPublicFromVisibility(e.visibility),
  };
}

/**
 * Global feed (paged)
 * GET /api/v1/entries?page={page}&size={size}&sort=date,desc
 */
export async function getEntriesPage(params?: {
  page?: number;
  size?: number;
}): Promise<{
  entries: Entry[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}> {
  const page = params?.page ?? 0;
  const size = params?.size ?? 10;

  const res = await authedGet<EntriesPageResponse>("/api/v1/entries", {
    params: { page, size, sort: "date,desc" },
  });

  return {
    entries: (res.entries ?? []).map(mapSummaryToEntry),
    page: res.page,
    size: res.size,
    totalElements: res.totalElements,
    totalPages: res.totalPages,
  };
}

/**
 * Ticket-scoped entries (NOT paged)
 * GET /api/v1/tickets/{ticketId}/entries
 */
export async function getEntriesForTicket(ticketId: string): Promise<Entry[]> {
  const res = await authedGet<EntrySummaryResponse[]>(
      `/api/v1/tickets/${ticketId}/entries`
  );

  return (res ?? []).map(mapSummaryToEntry);
}
