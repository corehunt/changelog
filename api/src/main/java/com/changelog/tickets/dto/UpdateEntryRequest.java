package com.changelog.tickets.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateEntryRequest {
    private Long id;
    private Long ticketId;
    private LocalDate date;
    private String title;
    private String body;
    private String[] technologies;
    private String visibility;
}
