package com.changelog.tickets.service;

import com.changelog.tickets.dto.DashboardHomeResponse;
import com.changelog.tickets.dto.DashboardMetrics;
import com.changelog.tickets.dto.EntrySummaryResponse;
import com.changelog.tickets.dto.TicketSummaryResponse;
import com.changelog.tickets.mapper.EntryMapper;
import com.changelog.tickets.mapper.TicketMapper;
import com.changelog.tickets.model.Entry;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.repository.EntryRepository;
import com.changelog.tickets.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private EntryRepository entryRepository;

    @Mock
    private TicketMapper ticketMapper;

    @Mock
    private EntryMapper entryMapper;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Test
    void getHomePageBuildsActiveTicketsRecentEntriesAndMetrics() {

        // Active tickets page (Query 1)
        Ticket activeTicket = Ticket.builder()
                .id(456530599L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        Page<Ticket> activeTicketsPage = new PageImpl<>(
                List.of(activeTicket),
                PageRequest.of(0, 10),
                1
        );

        when(ticketRepository.findByStatus(eq(TicketStatus.ACTIVE), any(PageRequest.class)))
                .thenReturn(activeTicketsPage);

        TicketSummaryResponse activeSummary = TicketSummaryResponse.builder()
                .id(456530599L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .build();

        when(ticketMapper.toSummary(activeTicket)).thenReturn(activeSummary);

        // Recent entries page (Query 2)
        OffsetDateTime mostRecentEntryDate = OffsetDateTime.parse("2025-12-12T18:00:00Z");

        Entry recentEntry = Entry.builder()
                .id(443682370L)
                .date(mostRecentEntryDate)
                .title("Identified bottlenecks")
                .body("Found inefficient JPA queries.")
                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                .visibility("Public")
                .build();

        Page<Entry> recentEntriesPage = new PageImpl<>(
                List.of(recentEntry),
                PageRequest.of(0, 5),
                1
        );

        when(entryRepository.findAll(any(PageRequest.class)))
                .thenReturn(recentEntriesPage);

        EntrySummaryResponse entrySummary = EntrySummaryResponse.builder()
                .entryId(443682370L)
                .ticketName("Refactor reevaluation processor")
                .ticketSlug("refactor-reevaluation-processor")
                .title("Identified bottlenecks")
                .date(mostRecentEntryDate)
                .visibility("Public")
                .build();

        when(entryMapper.toSummary(recentEntry)).thenReturn(entrySummary);

        // Metrics (Query 3)
        when(ticketRepository.countByStatus(TicketStatus.ACTIVE)).thenReturn(1L);
        when(ticketRepository.countByStatus(TicketStatus.COMPLETED)).thenReturn(3L);
        when(entryRepository.countByDateAfter(any(OffsetDateTime.class))).thenReturn(12L);

        // Execute
        DashboardHomeResponse result = dashboardService.getHomePage();

        // Verify queries were called
        verify(ticketRepository).findByStatus(eq(TicketStatus.ACTIVE), any(PageRequest.class));
        verify(entryRepository).findAll(any(PageRequest.class));
        verify(ticketRepository).countByStatus(TicketStatus.ACTIVE);
        verify(ticketRepository).countByStatus(TicketStatus.COMPLETED);
        verify(entryRepository).countByDateAfter(any(OffsetDateTime.class));

        // Assert active tickets mapped
        assertNotNull(result.getActiveTickets());
        assertEquals(1, result.getActiveTickets().size());
        assertEquals(456530599L, result.getActiveTickets().get(0).getId());
        assertEquals("refactor-reevaluation-processor", result.getActiveTickets().get(0).getSlug());
        assertEquals(TicketStatus.ACTIVE, result.getActiveTickets().get(0).getStatus());

        // Assert recent entries mapped
        assertNotNull(result.getRecentEntries());
        assertEquals(1, result.getRecentEntries().size());
        assertEquals(443682370L, result.getRecentEntries().get(0).getEntryId());
        assertEquals("refactor-reevaluation-processor", result.getRecentEntries().get(0).getTicketSlug());
        assertEquals(mostRecentEntryDate, result.getRecentEntries().get(0).getDate());

        // Assert metrics
        DashboardMetrics metrics = result.getMetrics();
        assertNotNull(metrics);
        assertEquals(1L, metrics.getActiveTickets());
        assertEquals(3L, metrics.getCompletedTickets());
        assertEquals(12L, metrics.getLogsThisWeek());
        assertEquals(mostRecentEntryDate, metrics.getLastUpdate());
    }

    @Test
    void getHomePageSetsLastUpdateNullWhenNoRecentEntries() {

        // Active tickets page (still can be empty)
        when(ticketRepository.findByStatus(eq(TicketStatus.ACTIVE), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 10), 0));

        // Recent entries empty page
        when(entryRepository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 5), 0));

        // Counts
        when(ticketRepository.countByStatus(TicketStatus.ACTIVE)).thenReturn(0L);
        when(ticketRepository.countByStatus(TicketStatus.COMPLETED)).thenReturn(0L);
        when(entryRepository.countByDateAfter(any(OffsetDateTime.class))).thenReturn(0L);

        DashboardHomeResponse result = dashboardService.getHomePage();

        assertNotNull(result.getMetrics());
        assertNull(result.getMetrics().getLastUpdate());
        assertEquals(0L, result.getMetrics().getActiveTickets());
        assertEquals(0L, result.getMetrics().getCompletedTickets());
        assertEquals(0L, result.getMetrics().getLogsThisWeek());

        assertNotNull(result.getActiveTickets());
        assertTrue(result.getActiveTickets().isEmpty());

        assertNotNull(result.getRecentEntries());
        assertTrue(result.getRecentEntries().isEmpty());
    }
}
