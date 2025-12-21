package com.changelog.tickets.controller;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.service.EntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/entries")
@RequiredArgsConstructor
@Slf4j
public class EntryController {

    private final EntryService entryService;

    @GetMapping
    public EntriesPageResponse getEntries(
            @PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("GET /api/v1/entries with pageable: {}", pageable);

        return entryService.getEntries(pageable);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EntrySummaryResponse> createEntry(@Valid @RequestBody CreateEntryRequest request) {

        log.info("POST /api/v1/entries request = {}", request);

        EntrySummaryResponse created = entryService.createEntry(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);

    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public EntryDetailResponse updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEntryRequest request) {

        log.info("PUT /api/v1/entries request = {}", request);

        return entryService.updateEntry(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteEntry(@PathVariable Long id) {
        log.info("DELETE /api/v1/entries request = {}", id);
        entryService.deleteEntry(id);
    }

}
