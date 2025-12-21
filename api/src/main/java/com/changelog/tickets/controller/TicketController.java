package com.changelog.tickets.controller;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.service.TicketService;
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

import java.util.List;


@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Slf4j
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public TicketsPageResponse getTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String statusNot,
            @RequestParam(required = false) String visibility,
            @RequestParam(required = false) String search,
            @PageableDefault(page = 0, size = 10, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        log.info("GET /api/v1/tickets status={}, statusNot={}, visibility={}, pageable={}, search={}",
                status, statusNot, visibility, pageable, search);

        TicketStatus parsedStatus = null;
        if (status != null && !status.isBlank()) {
            parsedStatus = TicketStatus.valueOf(status);
        }

        TicketStatus parsedStatusNot = null;
        if (statusNot != null && !statusNot.isBlank()) {
            parsedStatusNot = TicketStatus.valueOf(statusNot);
        }

        TicketFilters filters = TicketFilters.builder()
                .status(parsedStatus)
                .statusNot(parsedStatusNot)
                .visibility(visibility)
                .search(search)
                .build();

        return ticketService.getTickets(filters, pageable);
    }

    @GetMapping("/{ticketId}/entries")
    public List<EntrySummaryResponse> getEntriesForTicket(@PathVariable Long ticketId) {
        log.info("GET /api/v1/tickets/{}/entries", ticketId);

        return ticketService.getEntriesForTicket(ticketId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketSummaryResponse> createTicket(@Valid @RequestBody CreateTicketRequest request) {

        log.info("POST /api/v1/tickets request={}", request);

        TicketSummaryResponse created = ticketService.createTicket(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public TicketDetailResponse getTicketById(@PathVariable Long id) {
        log.info("GET id - /api/v1/tickets/{}", id);
        return ticketService.getTicketById(id);
    }

    @GetMapping("/slug/{slug}")
    public TicketDetailResponse getTicketBySlug(@PathVariable String slug) {
        log.info("GET slug - /api/v1/tickets/{}", slug);
        return ticketService.getTicketBySlug(slug);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public TicketDetailResponse updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketRequest request) {
        log.info("PUT /api/v1/tickets/{}", id);

        return ticketService.updateTicket(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void archiveTicket(@PathVariable Long id) {
        log.info("DELETE /api/v1/tickets/{} (soft delete -> ARCHIVED)", id);
        ticketService.archiveTicket(id);
    }

}
