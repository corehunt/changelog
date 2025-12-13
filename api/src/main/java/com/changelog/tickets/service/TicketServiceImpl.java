package com.changelog.tickets.service;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.exception.TicketNotFoundException;
import com.changelog.tickets.mapper.TicketMapper;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.repository.TicketRepository;
import com.changelog.tickets.util.TicketIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketIdGenerator ticketIdGenerator;
    private final TicketMapper ticketMapper;

    @Override
    public TicketsPageResponse getTickets(TicketFilters filters, Pageable pageable) {

        Page<Ticket> page;

        if (filters.getStatus() != null && !filters.getStatus().isBlank()) {
            page = ticketRepository.findByStatus(filters.getStatus(), pageable);
        } else {
            page = ticketRepository.findAll(pageable);
        }

        List<TicketSummaryResponse> summaries = page.getContent().stream()
                .map(this::toSummary)
                .toList();

        return TicketsPageResponse.builder()
                .tickets(summaries)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public TicketSummaryResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = Ticket.builder()
                .id(ticketIdGenerator.generateId())
                .title(request.getTitle())
                .slug(request.getSlug())
                .status(request.getStatus())
                .visibility(request.getVisibility())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .background(request.getBackground())
                .technologies(request.getTechnologies())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        return toSummary(savedTicket);
    }

    @Override
    public TicketDetailResponse getTicketById(Long id) {

        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        return TicketDetailResponse.builder()
                .id(ticket.getId())
                .slug(ticket.getSlug())
                .title(ticket.getTitle())
                .status(ticket.getStatus())
                .visibility(ticket.getVisibility())
                .startDate(ticket.getStartDate())
                .endDate(ticket.getEndDate())
                .background(ticket.getBackground())
                .technologies(ticket.getTechnologies())
                .learned(ticket.getLearned())
                .roadblocksSummary(ticket.getRoadblocksSummary())
                .metricsSummary(ticket.getMetricsSummary())
                .build();
    }

    @Override
    @Transactional
    public TicketDetailResponse updateTicket(Long id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        ticket.setSlug(request.getSlug());
        ticket.setBackground(request.getBackground());
        ticket.setStatus(request.getStatus());
        ticket.setVisibility(request.getVisibility());
        ticket.setStartDate(request.getStartDate());
        ticket.setEndDate(request.getEndDate());
        ticket.setLearned(request.getLearned());
        ticket.setRoadblocksSummary(request.getRoadblocksSummary());
        ticket.setMetricsSummary(request.getMetricsSummary());
        ticket.setTechnologies(request.getTechnologies());

        Ticket savedTicket = ticketRepository.save(ticket);

        return ticketMapper.toDetailResponse(savedTicket);
    }

    @Override
    public void archiveTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        ticket.setStatus(TicketStatus.ARCHIVED);
        ticketRepository.save(ticket);
    }

    private TicketSummaryResponse toSummary(Ticket ticket) {
        return TicketSummaryResponse.builder()
                .id(ticket.getId())
                .slug(ticket.getSlug())
                .title(ticket.getTitle())
                .status(ticket.getStatus())
                .startDate(ticket.getStartDate())
                .endDate(ticket.getEndDate())
                .technologies(ticket.getTechnologies())
                .build();
    }

}