package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DashboardMetrics {
    private long activeTickets;
    private long completedTickets;
    private long logsThisWeek;
    private LocalDate lastUpdate;
}