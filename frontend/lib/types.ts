export type TicketStatus = "ACTIVE" | "COMPLETED";

export type Ticket = {
  id: string;
  slug: string;
  title: string;
  status: TicketStatus;
  startDate: string;
  endDate?: string;
  background?: string;
  technologies: string[];
  learned?: string;
  roadblocksSummary?: string;
  metricsSummary?: string;
  isPublic: boolean;
};

export type Entry = {
  id: string;
  ticketId: string;
  date: string;
  title?: string;
  body?: string;
  technologies: string[];
  isPublic: boolean;
};
