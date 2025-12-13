package com.changelog.tickets.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class UpdateEntryRequest {
    private Long id;
    private Long ticketId;
    private OffsetDateTime date;
    private String title;
    private String body;
    private String[] technologies;
    private String visibility;
}
