// frontend/lib/api/tickets.ts
import { authedGet } from "../http";
import type { Entry, Ticket, TicketStatus } from "../types";

type BackendEntrySummaryResponse = {
  entryId: number;
  ticketName: string;
  ticketSlug: string;
  title?: string | null;
  body?: string | null;
  technologies: string[];
  date: string;
  visibility: string;
};

type BackendTicketDetailResponse = {
  id: number;
  slug: string;
  title: string;
  status: TicketStatus;
  visibility: string;
  startDate: string;
  endDate?: string | null;
  background?: string | null;
  technologies: string[];
  learned?: string | null;
  roadblocksSummary?: string | null;
  metricsSummary?: string | null;
  entries: BackendEntrySummaryResponse[];
};


export type TicketDetail = Ticket & {
  entries: Entry[];
};

function isPublicFromVisibility(visibility?: string): boolean {
  return String(visibility ?? "").toUpperCase() === "PUBLIC";
}

function mapBackendEntryToEntry(dto: BackendEntrySummaryResponse): Entry {
  return {
    id: String(dto.entryId),
    ticketName: dto.ticketName,
    ticketSlug: dto.ticketSlug,
    date: dto.date,
    title: dto.title ?? undefined,
    body: dto.body ?? undefined,
    technologies: dto.technologies ?? [],
    isPublic: isPublicFromVisibility(dto.visibility),
  };
}

function mapBackendDetailToTicketDetail(dto: BackendTicketDetailResponse): TicketDetail {
  return {
    id: String(dto.id),
    slug: dto.slug,
    title: dto.title,
    status: dto.status,
    startDate: dto.startDate,
    endDate: dto.endDate ?? undefined,
    background: dto.background ?? undefined,
    technologies: dto.technologies ?? [],
    learned: dto.learned ?? undefined,
    roadblocksSummary: dto.roadblocksSummary ?? undefined,
    metricsSummary: dto.metricsSummary ?? undefined,
    isPublic: isPublicFromVisibility(dto.visibility),
    entries: (dto.entries ?? []).map(mapBackendEntryToEntry),
  };
}

/**
 * Loads ticket + entries in ONE call:
 * GET /api/v1/tickets/slug/{slug}
 */
export async function getTicketDetailBySlug(slug: string): Promise<TicketDetail | null> {
  try {
    const dto = await authedGet<BackendTicketDetailResponse>(
        `/api/v1/tickets/slug/${slug}`
    );
    return mapBackendDetailToTicketDetail(dto);
  } catch (e: any) {
    if (e?.status === 404) return null;
    throw e;
  }
}
