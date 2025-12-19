package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TicketSummaryResponse {
    private Long id;
    private String slug;
    private String title;
    private String background;
    private TicketStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String[] technologies;
}
