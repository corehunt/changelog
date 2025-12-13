package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class EntryDetailResponse {
    private Long id;
    private OffsetDateTime date;
    private String title;
    private String body;
    private String[] technologies;
    private String visibility;


}
