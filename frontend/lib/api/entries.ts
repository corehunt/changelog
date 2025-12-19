// frontend/lib/api/entries.ts
import { authedGet, authedPut } from "../http";
import { Entry } from "../types";

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

export type BackendEntryDetailResponse = {
  id: number;
  date: string;
  title: string | null;
  body: string | null;
  technologies: string[];
  visibility: string;
};

export type UpdateEntryPayload = {
  ticketId: number;
  date: string;
  title: string;
  body: string;
  technologies: string[];
  visibility: "Public" | "Private";
};

/**
 * GET /api/v1/tickets/{ticketId}/entries
 * (No pagination — returns all entries for a ticket)
 */
export async function getEntriesForTicket(ticketId: string | number): Promise<Entry[]> {
  const dto = await authedGet<EntrySummaryResponse[]>(`/api/v1/tickets/${ticketId}/entries`);

  return (dto ?? []).map((e) => ({
    id: String(e.entryId),
    ticketName: e.ticketName,
    ticketSlug: e.ticketSlug,
    date: e.date,
    title: e.title ?? undefined,
    body: e.body ?? undefined,
    technologies: e.technologies ?? [],
    isPublic: e.visibility === "Public",
  }));
}

/**
 * PUT /api/v1/entries/{id}
 * Updates an existing entry.
 */
export async function updateEntry(entryId: string | number, payload: UpdateEntryPayload) {
  const dto = await authedPut<BackendEntryDetailResponse>(`/api/v1/entries/${entryId}`, payload);

  return {
    id: String(dto.id),
    date: dto.date,
    title: dto.title ?? undefined,
    body: dto.body ?? undefined,
    technologies: dto.technologies ?? [],
    isPublic: dto.visibility === "Public",
  };
}
