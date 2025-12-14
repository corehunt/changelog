import { authedGet } from "../http";
import { Ticket } from "../types";

export type DashboardMetrics = {
    activeTickets: number;
    completedTickets: number;
    logsThisWeek: number;
    lastUpdate: string | null;
};

export type EntrySummary = {
    entryId: number;
    ticketName: string;
    title: string;
    body: string;
    technologies: string[];
    date: string;
    visibility: string;
};

export type DashboardHomeResponse = {
    activeTickets: Ticket[];
    recentEntries: EntrySummary[];
    metrics: DashboardMetrics;
};

export async function getDashboardHome(): Promise<DashboardHomeResponse> {
    return authedGet<DashboardHomeResponse>("/api/v1/dashboard/home");
}
