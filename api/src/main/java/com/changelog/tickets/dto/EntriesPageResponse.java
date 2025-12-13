package com.changelog.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EntriesPageResponse {
    List<EntrySummaryResponse> entries;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
