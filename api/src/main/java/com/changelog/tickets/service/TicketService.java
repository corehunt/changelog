package com.changelog.tickets.service;

import com.changelog.tickets.dto.*;
import org.springframework.data.domain.Pageable;

public interface TicketService {

    TicketsPageResponse getTickets(TicketFilters filters, Pageable pageable);

    TicketSummaryResponse createTicket(CreateTicketRequest request);

    TicketDetailResponse getTicketById(Long id);

    TicketDetailResponse updateTicket(Long id, UpdateTicketRequest request);

    void archiveTicket(Long id);
}