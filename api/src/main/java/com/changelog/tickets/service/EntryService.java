package com.changelog.tickets.service;

import com.changelog.tickets.dto.*;
import org.springframework.data.domain.Pageable;

public interface EntryService {

    EntriesPageResponse getEntries(Pageable pageable);

    EntrySummaryResponse createEntry(CreateEntryRequest createEntryRequest);

    EntryDetailResponse updateEntry(Long id, UpdateEntryRequest updateEntryRequest);

    void deleteEntry(Long id);
}
