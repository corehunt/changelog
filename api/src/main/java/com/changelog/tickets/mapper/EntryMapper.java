package com.changelog.tickets.mapper;

import com.changelog.tickets.dto.EntryDetailResponse;
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
}
