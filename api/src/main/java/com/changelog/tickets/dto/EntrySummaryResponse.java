package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class EntrySummaryResponse {
    private Long entryId;
    private String ticketName;
    private String title;
    private String body;
    private String[] technologies;
    private OffsetDateTime date;
    private String visibility;
}
