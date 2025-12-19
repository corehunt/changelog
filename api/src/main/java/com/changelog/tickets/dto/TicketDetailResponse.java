package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TicketDetailResponse {
    private Long id;
    private String slug;
    private String title;
    private TicketStatus status;
    private String visibility;
    private LocalDate startDate;
    private LocalDate endDate;
    private String background;
    private String[] technologies;
    private String learned;
    private String roadblocksSummary;
    private String metricsSummary;
    private List<EntrySummaryResponse> entries;

}
