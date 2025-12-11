package com.changelog.tickets.controller;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Slf4j
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public TicketsPageResponse getTickets(
            @RequestParam(required = false) String status,
            @PageableDefault(page = 0, size = 10, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("GET /api/v1/tickets status={}, pageable={}", status, pageable);

        TicketFilters filters = TicketFilters.builder()
                .status(status)
                .build();

        return ticketService.getTickets(filters, pageable);
    }

    @PostMapping
    public ResponseEntity<TicketSummaryResponse> createTicket(@Valid @RequestBody CreateTicketRequest request) {

        log.info("POST /api/v1/tickets request={}", request);

        TicketSummaryResponse created = ticketService.createTicket(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public TicketDetailResponse getTicketById(@PathVariable Long id) {
        log.info("GET /api/v1/tickets/{}", id);
        return ticketService.getTicketById(id);
    }

    @PutMapping("/{id}")
    public TicketDetailResponse updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketRequest request) {
        log.info("PUT /api/v1/tickets/{}", id);

        return ticketService.updateTicket(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archiveTicket(@PathVariable Long id) {
        log.info("DELETE /api/v1/tickets/{} (soft delete -> ARCHIVED)", id);
        ticketService.archiveTicket(id);
    }

}
