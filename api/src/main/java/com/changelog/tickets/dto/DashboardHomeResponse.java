package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardHomeResponse {
    private List<TicketSummaryResponse> activeTickets;
    private List<EntrySummaryResponse> recentEntries;
    private DashboardMetrics metrics;
}