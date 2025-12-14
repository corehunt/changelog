package com.changelog.tickets.mapper;

import com.changelog.tickets.dto.EntryDetailResponse;
import com.changelog.tickets.dto.EntrySummaryResponse;
import com.changelog.tickets.model.Entry;
import org.springframework.stereotype.Component;

@Component
public class EntryMapper {

    public EntryDetailResponse toDetailResponse(Entry entry) {
        if (entry == null) {
            return null;
        }

        return EntryDetailResponse.builder()
                .id(entry.getId())
                .date(entry.getDate())
                .title(entry.getTitle())
                .body(entry.getBody())
                .technologies(entry.getTechnologies())
                .visibility(entry.getVisibility())
                .build();
    }

    public EntrySummaryResponse toSummary(Entry entry) {
        return EntrySummaryResponse.builder()
                .entryId(entry.getId())
                .ticketName(entry.getTicket().getTitle())
                .title(entry.getTitle())
                .body(entry.getBody())
                .technologies(entry.getTechnologies())
                .date(entry.getDate())
                .visibility(entry.getVisibility())
                .build();
    }
}
