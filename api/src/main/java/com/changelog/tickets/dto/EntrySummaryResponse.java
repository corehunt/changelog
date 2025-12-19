package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EntrySummaryResponse {
    private Long entryId;
    private String ticketName;
    private String ticketSlug;
    private String title;
    private String body;
    private String[] technologies;
    private LocalDate date;
    private String visibility;
}
