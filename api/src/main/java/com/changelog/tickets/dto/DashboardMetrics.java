package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class DashboardMetrics {
    private long activeTickets;
    private long completedTickets;
    private long logsThisWeek;
    private OffsetDateTime lastUpdate;
}