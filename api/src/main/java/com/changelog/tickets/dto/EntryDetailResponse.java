package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EntryDetailResponse {
    private Long id;
    private LocalDate date;
    private String title;
    private String body;
    private String[] technologies;
    private String visibility;


}
