package com.changelog.tickets.service;

import com.changelog.tickets.dto.DashboardHomeResponse;
import com.changelog.tickets.dto.DashboardMetrics;
import com.changelog.tickets.mapper.EntryMapper;
import com.changelog.tickets.mapper.TicketMapper;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.repository.EntryRepository;
import com.changelog.tickets.repository.TicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;
    private final EntryRepository entryRepository;
    private final TicketMapper ticketMapper;
    private final EntryMapper entryMapper;

    @Override
    @Transactional
    public DashboardHomeResponse getHomePage() {
        // Query 1: active tickets list (bounded)
        var activeTicketsPage = ticketRepository.findByStatus(
                TicketStatus.ACTIVE,
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "startDate"))
        );

        // Query 2: recent entries list (bounded)
        var recentEntriesPage = entryRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "date"))
        );

        // Query 3: metrics (counts + last update)
        LocalDate oneWeekAgo = LocalDate.now().minusDays(7);

        //TODO bring back all tickets and count in memory
        long activeCount = ticketRepository.countByStatus(TicketStatus.ACTIVE);
        long completedCount = ticketRepository.countByStatus(TicketStatus.COMPLETED);
        long logsThisWeek = entryRepository.countByDateAfter(oneWeekAgo);

        LocalDate lastUpdate = recentEntriesPage.getContent().isEmpty()
                ? null
                : recentEntriesPage.getContent().get(0).getDate();

        return DashboardHomeResponse.builder()
                .activeTickets(activeTicketsPage.getContent().stream().map(ticketMapper::toSummary).toList())
                .recentEntries(recentEntriesPage.getContent().stream().map(entryMapper::toSummary).toList())
                .metrics(DashboardMetrics.builder()
                        .activeTickets(activeCount)
                        .completedTickets(completedCount)
                        .logsThisWeek(logsThisWeek)
                        .lastUpdate(lastUpdate)
                        .build())
                .build();
    }
}
