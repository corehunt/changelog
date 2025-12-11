package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class TicketSummaryResponse {
    private Long id;
    private String slug;
    private String title;
    private TicketStatus status;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String[] technologies;
}
