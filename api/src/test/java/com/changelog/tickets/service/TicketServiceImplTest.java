package com.changelog.tickets.service;

import com.changelog.tickets.dto.CreateTicketRequest;
import com.changelog.tickets.dto.TicketDetailResponse;
import com.changelog.tickets.dto.TicketFilters;
import com.changelog.tickets.dto.TicketSummaryResponse;
import com.changelog.tickets.dto.TicketsPageResponse;
import com.changelog.tickets.dto.UpdateTicketRequest;
import com.changelog.tickets.exception.TicketNotFoundException;
import com.changelog.tickets.mapper.TicketMapper;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.repository.TicketRepository;
import com.changelog.tickets.util.TicketIdGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceImplTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private TicketIdGenerator ticketIdGenerator;

    @Mock
    private TicketMapper ticketMapper;

    @InjectMocks
    private TicketServiceImpl ticketService;

    @Test
    void getTicketsWithStatusFilterUsesFindByStatusAndMapsPage() {

        TicketFilters filters = new TicketFilters(TicketStatus.ACTIVE);
        Pageable pageable = PageRequest.of(0, 10);

        Ticket ticket = Ticket.builder()
                .id(1L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        Page<Ticket> page = new PageImpl<>(List.of(ticket), pageable, 1);

        when(ticketRepository.findByStatus(TicketStatus.ACTIVE, pageable)).thenReturn(page);

        TicketsPageResponse result = ticketService.getTickets(filters, pageable);

        verify(ticketRepository).findByStatus(TicketStatus.ACTIVE, pageable);

        assertEquals(0, result.getPage());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(1, result.getTickets().size());

        TicketSummaryResponse summary = result.getTickets().get(0);
        assertEquals(1L, summary.getId());
        assertEquals("refactor-reevaluation-processor", summary.getSlug());
        assertEquals(TicketStatus.ACTIVE, summary.getStatus());
    }

    @Test
    void getTicketsWithoutStatusFilterUsesFindAll() {

        TicketFilters filters = new TicketFilters(null);
        Pageable pageable = PageRequest.of(0, 5);

        Ticket ticket = Ticket.builder()
                .id(2L)
                .slug("some-other-ticket")
                .title("Some other ticket")
                .status(TicketStatus.COMPLETED)
                .startDate(OffsetDateTime.parse("2025-12-09T10:00:00Z"))
                .build();

        Page<Ticket> page = new PageImpl<>(List.of(ticket), pageable, 1);

        when(ticketRepository.findAll(any(Pageable.class))).thenReturn(page);

        TicketsPageResponse result = ticketService.getTickets(filters, pageable);

        verify(ticketRepository).findAll(pageable);

        assertEquals(0, result.getPage());
        assertEquals(5, result.getSize());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTickets().size());
        assertEquals(2L, result.getTickets().get(0).getId());
    }

    @Test
    void createTicketGeneratesIdSavesEntityAndReturnsSummary() {

        CreateTicketRequest request = new CreateTicketRequest();
        request.setTitle("Refactor reevaluation processor");
        request.setSlug("refactor-reevaluation-processor");
        request.setStatus(TicketStatus.ACTIVE);
        request.setVisibility("P");
        request.setStartDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"));
        request.setEndDate(null);
        request.setBackground("Background");
        request.setTechnologies(new String[]{"Java", "Spring Boot"});

        long generatedId = 417555206L;
        when(ticketIdGenerator.generateId()).thenReturn(generatedId);

        Ticket saved = Ticket.builder()
                .id(generatedId)
                .title(request.getTitle())
                .slug(request.getSlug())
                .status(request.getStatus())
                .visibility(request.getVisibility())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .background(request.getBackground())
                .technologies(request.getTechnologies())
                .build();

        when(ticketRepository.save(any(Ticket.class))).thenReturn(saved);

        TicketSummaryResponse result = ticketService.createTicket(request);

        verify(ticketIdGenerator).generateId();

        ArgumentCaptor<Ticket> ticketCaptor = ArgumentCaptor.forClass(Ticket.class);
        verify(ticketRepository).save(ticketCaptor.capture());
        Ticket toSave = ticketCaptor.getValue();

        assertEquals(generatedId, toSave.getId());
        assertEquals("Refactor reevaluation processor", toSave.getTitle());
        assertEquals("refactor-reevaluation-processor", toSave.getSlug());
        assertEquals(TicketStatus.ACTIVE, toSave.getStatus());
        assertEquals("P", toSave.getVisibility());

        assertEquals(generatedId, result.getId());
        assertEquals("refactor-reevaluation-processor", result.getSlug());
        assertEquals(TicketStatus.ACTIVE, result.getStatus());
    }

    @Test
    void getTicketByIdReturnsDetailResponseWhenTicketExists() {

        Long id = 123L;
        Ticket ticket = Ticket.builder()
                .id(id)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .visibility("P")
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .background("Background")
                .technologies(new String[]{"Java", "Spring Boot"})
                .learned("Learned stuff")
                .roadblocksSummary("Roadblocks")
                .metricsSummary("Metrics")
                .build();

        when(ticketRepository.findById(id)).thenReturn(Optional.of(ticket));

        TicketDetailResponse result = ticketService.getTicketById(id);

        verify(ticketRepository).findById(id);

        assertEquals(id, result.getId());
        assertEquals("refactor-reevaluation-processor", result.getSlug());
        assertEquals(TicketStatus.ACTIVE, result.getStatus());
        assertEquals("Background", result.getBackground());
        assertEquals("Learned stuff", result.getLearned());
        assertEquals("Roadblocks", result.getRoadblocksSummary());
        assertEquals("Metrics", result.getMetricsSummary());
    }

    @Test
    void getTicketByIdThrowsTicketNotFoundWhenMissing() {

        Long id = 999L;
        when(ticketRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(TicketNotFoundException.class, () -> ticketService.getTicketById(id));
    }

    @Test
    void updateTicketUpdatesFieldsSavesAndReturnsMappedDetail() {

        Long id = 123L;

        Ticket existing = Ticket.builder()
                .id(id)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .visibility("P")
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        UpdateTicketRequest request = new UpdateTicketRequest();
        request.setSlug("refactor-reevaluation-processor");
        request.setBackground("Updated background");
        request.setStatus(TicketStatus.COMPLETED);
        request.setVisibility("P");
        request.setStartDate(existing.getStartDate());
        request.setEndDate(OffsetDateTime.parse("2025-12-12T18:00:00Z"));
        request.setLearned("Learned advanced batching strategies.");
        request.setRoadblocksSummary("Some roadblocks.");
        request.setMetricsSummary("Cut from 15m to 30s.");
        request.setTechnologies(new String[]{"Java", "Spring Boot", "PostgreSQL", "Hibernate"});

        when(ticketRepository.findById(id)).thenReturn(Optional.of(existing));
        when(ticketRepository.save(any(Ticket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TicketDetailResponse mapped = TicketDetailResponse.builder()
                .id(id)
                .slug(request.getSlug())
                .title(existing.getTitle())
                .status(request.getStatus())
                .visibility("P")
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .background(request.getBackground())
                .technologies(request.getTechnologies())
                .learned(request.getLearned())
                .roadblocksSummary(request.getRoadblocksSummary())
                .metricsSummary(request.getMetricsSummary())
                .build();

        when(ticketMapper.toDetailResponse(any(Ticket.class))).thenReturn(mapped);

        TicketDetailResponse result = ticketService.updateTicket(id, request);

        ArgumentCaptor<Ticket> ticketCaptor = ArgumentCaptor.forClass(Ticket.class);
        verify(ticketRepository).save(ticketCaptor.capture());

        Ticket saved = ticketCaptor.getValue();

        assertEquals(TicketStatus.COMPLETED, saved.getStatus());
        assertEquals(request.getEndDate(), saved.getEndDate());
        assertEquals("Updated background", saved.getBackground());
        assertEquals("Cut from 15m to 30s.", saved.getMetricsSummary());
        assertArrayEquals(
                new String[]{"Java", "Spring Boot", "PostgreSQL", "Hibernate"},
                saved.getTechnologies()
        );

        verify(ticketMapper).toDetailResponse(saved);
        assertEquals(mapped, result);
    }

    @Test
    void updateTicketThrowsTicketNotFoundWhenMissing() {
        Long id = 999L;
        when(ticketRepository.findById(id)).thenReturn(Optional.empty());

        UpdateTicketRequest request = new UpdateTicketRequest();

        assertThrows(TicketNotFoundException.class, () -> ticketService.updateTicket(id, request));
    }

    @Test
    void archiveTicketSetsStatusArchivedAndSaves() {

        Long id = 123L;

        Ticket existing = Ticket.builder()
                .id(id)
                .status(TicketStatus.ACTIVE)
                .build();

        when(ticketRepository.findById(id)).thenReturn(Optional.of(existing));

        ticketService.archiveTicket(id);

        assertEquals(TicketStatus.ARCHIVED, existing.getStatus());
        verify(ticketRepository).save(existing);
    }

    @Test
    void archiveTicketThrowsTicketNotFoundWhenMissing() {

        Long id = 999L;
        when(ticketRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(TicketNotFoundException.class, () -> ticketService.archiveTicket(id));
    }
}
