package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class UpdateTicketRequest {
    private String slug;
    private String title;
    private TicketStatus status;
    private String visibility;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String background;
    private String[] technologies;
    private String learned;
    private String roadblocksSummary;
    private String metricsSummary;
}
