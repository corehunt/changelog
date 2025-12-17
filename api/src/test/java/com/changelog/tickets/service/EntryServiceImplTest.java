package com.changelog.tickets.service;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.exception.EntryNotFoundException;
import com.changelog.tickets.exception.TicketNotFoundException;
import com.changelog.tickets.mapper.EntryMapper;
import com.changelog.tickets.model.Entry;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.repository.EntryRepository;
import com.changelog.tickets.repository.TicketRepository;
import com.changelog.tickets.util.EntryIdGenerator;
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
class EntryServiceImplTest {

    @Mock
    private EntryRepository entryRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private EntryIdGenerator entryIdGenerator;

    @Mock
    private EntryMapper entryMapper;

    @InjectMocks
    private EntryServiceImpl entryService;

    @Test
    void getEntriesUsesFindAllAndMapsPage() {
        Pageable pageable = PageRequest.of(0, 10);

        Entry entry = Entry.builder()
                .id(443682370L)
                .date(OffsetDateTime.parse("2025-12-10T17:30:00Z"))
                .title("Identified bottlenecks")
                .body("Found inefficient JPA queries.")
                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                .visibility("Public")
                .build();

        EntrySummaryResponse summary = EntrySummaryResponse.builder()
                .entryId(443682370L)
                .ticketName("Refactor reevaluation processor")
                .ticketSlug("refactor-reevaluation-processor")
                .title("Identified bottlenecks")
                .visibility("Public")
                .build();

        Page<Entry> page = new PageImpl<>(List.of(entry), pageable, 1);

        when(entryRepository.findAll(pageable)).thenReturn(page);
        when(entryMapper.toSummary(any(Entry.class))).thenReturn(summary);

        EntriesPageResponse result = entryService.getEntries(pageable);

        verify(entryRepository).findAll(pageable);
        verify(entryMapper).toSummary(entry);

        assertEquals(0, result.getPage());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(1, result.getEntries().size());

        EntrySummaryResponse first = result.getEntries().get(0);
        assertEquals(443682370L, first.getEntryId());
        assertEquals("refactor-reevaluation-processor", first.getTicketSlug());
    }

    @Test
    void createEntryFindsTicketGeneratesIdSavesAndReturnsSummary() {
        CreateEntryRequest request = new CreateEntryRequest();
        request.setTicketId("456530599");
        request.setTitle("Identified bottlenecks");
        request.setBody("Initial analysis");
        request.setTechnologies(new String[]{"Spring Boot", "Hibernate"});
        request.setDate(OffsetDateTime.parse("2025-12-10T17:30:00Z"));
        request.setVisibility("Public");

        Ticket ticket = Ticket.builder()
                .id(456530599L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .build();

        long generatedId = 417555206L;
        when(ticketRepository.findById(Long.valueOf(request.getTicketId()))).thenReturn(Optional.of(ticket));
        when(entryIdGenerator.generateId()).thenReturn(generatedId);

        when(entryRepository.save(any(Entry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        EntrySummaryResponse mappedSummary = EntrySummaryResponse.builder()
                .entryId(generatedId)
                .ticketName(ticket.getTitle())
                .ticketSlug(ticket.getSlug())
                .title(request.getTitle())
                .body(request.getBody())
                .technologies(request.getTechnologies())
                .date(request.getDate())
                .visibility(request.getVisibility())
                .build();

        when(entryMapper.toSummary(any(Entry.class))).thenReturn(mappedSummary);

        EntrySummaryResponse result = entryService.createEntry(request);

        verify(ticketRepository).findById(456530599L);
        verify(entryIdGenerator).generateId();

        ArgumentCaptor<Entry> entryCaptor = ArgumentCaptor.forClass(Entry.class);
        verify(entryRepository).save(entryCaptor.capture());
        Entry toSave = entryCaptor.getValue();

        assertEquals(generatedId, toSave.getId());
        assertEquals(ticket, toSave.getTicket());
        assertEquals(request.getTitle(), toSave.getTitle());
        assertEquals(request.getBody(), toSave.getBody());
        assertEquals(request.getDate(), toSave.getDate());
        assertArrayEquals(new String[]{"Spring Boot", "Hibernate"}, toSave.getTechnologies());
        assertEquals("Public", toSave.getVisibility());

        verify(entryMapper).toSummary(any(Entry.class));
        assertEquals(generatedId, result.getEntryId());
        assertEquals("refactor-reevaluation-processor", result.getTicketSlug());
    }

    @Test
    void createEntryThrowsTicketNotFoundWhenMissing() {
        CreateEntryRequest request = new CreateEntryRequest();
        request.setTicketId("999");

        when(ticketRepository.findById(Long.valueOf(request.getTicketId()))).thenReturn(Optional.empty());

        assertThrows(TicketNotFoundException.class, () -> entryService.createEntry(request));

        verify(ticketRepository).findById(999L);
        verifyNoInteractions(entryRepository);
        verify(entryIdGenerator, never()).generateId();
    }

    @Test
    void updateEntryUpdatesFieldsSavesAndReturnsDetail() {
        Long id = 443682370L;

        Entry existing = Entry.builder()
                .id(id)
                .date(OffsetDateTime.parse("2025-12-10T17:30:00Z"))
                .title("Old title")
                .body("Old body")
                .technologies(new String[]{"Spring Boot"})
                .visibility("Public")
                .build();

        UpdateEntryRequest request = new UpdateEntryRequest();
        request.setTitle("Updated title");
        request.setBody("Updated body");
        request.setTechnologies(new String[]{"Spring Boot", "PostgreSQL"});
        request.setDate(OffsetDateTime.parse("2025-12-11T12:00:00Z"));
        request.setVisibility("Public");

        when(entryRepository.findById(id)).thenReturn(Optional.of(existing));
        when(entryRepository.save(any(Entry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        EntryDetailResponse mapped = EntryDetailResponse.builder()
                .id(id)
                .title(request.getTitle())
                .body(request.getBody())
                .technologies(request.getTechnologies())
                .date(request.getDate())
                .visibility(request.getVisibility())
                .build();

        when(entryMapper.toDetailResponse(any(Entry.class))).thenReturn(mapped);

        EntryDetailResponse result = entryService.updateEntry(id, request);

        ArgumentCaptor<Entry> entryCaptor = ArgumentCaptor.forClass(Entry.class);
        verify(entryRepository).save(entryCaptor.capture());
        Entry saved = entryCaptor.getValue();

        assertEquals("Updated title", saved.getTitle());
        assertEquals("Updated body", saved.getBody());
        assertEquals(OffsetDateTime.parse("2025-12-11T12:00:00Z"), saved.getDate());
        assertArrayEquals(new String[]{"Spring Boot", "PostgreSQL"}, saved.getTechnologies());
        assertEquals("Public", saved.getVisibility());

        verify(entryMapper).toDetailResponse(saved);
        assertEquals(mapped, result);
    }

    @Test
    void updateEntryThrowsEntryNotFoundWhenMissing() {
        Long id = 999L;
        when(entryRepository.findById(id)).thenReturn(Optional.empty());

        UpdateEntryRequest request = new UpdateEntryRequest();

        assertThrows(EntryNotFoundException.class, () -> entryService.updateEntry(id, request));

        verify(entryRepository).findById(id);
        verify(entryRepository, never()).save(any());
        verifyNoInteractions(entryMapper);
    }

    @Test
    void deleteEntryFindsAndDeletes() {
        Long id = 443682370L;

        Entry existing = Entry.builder().id(id).build();
        when(entryRepository.findById(id)).thenReturn(Optional.of(existing));
        doNothing().when(entryRepository).delete(existing);

        entryService.deleteEntry(id);

        verify(entryRepository).findById(id);
        verify(entryRepository).delete(existing);
    }

    @Test
    void deleteEntryThrowsEntryNotFoundWhenMissing() {
        Long id = 999L;
        when(entryRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntryNotFoundException.class, () -> entryService.deleteEntry(id));

        verify(entryRepository).findById(id);
        verify(entryRepository, never()).delete(any());
    }
}
