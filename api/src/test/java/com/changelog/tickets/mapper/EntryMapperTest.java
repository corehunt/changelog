package com.changelog.tickets.mapper;

import com.changelog.tickets.dto.EntryDetailResponse;
import com.changelog.tickets.dto.EntrySummaryResponse;
import com.changelog.tickets.model.Entry;
import com.changelog.tickets.model.Ticket;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EntryMapperTest {

    private final EntryMapper mapper = new EntryMapper();

    @Test
    void toSummaryMapsAllFields() {
        Ticket ticket = Ticket.builder()
                .id(123L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .build();

        Entry entry = Entry.builder()
                .id(443682370L)
                .ticket(ticket)
                .date(LocalDate.of(2025, 12, 10))
                .title("Identified bottlenecks")
                .body("Found inefficient JPA queries.")
                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                .visibility("Public")
                .build();

        EntrySummaryResponse result = mapper.toSummary(entry);

        assertEquals(443682370L, result.getEntryId());
        assertEquals("Refactor reevaluation processor", result.getTicketName());
        assertEquals("refactor-reevaluation-processor", result.getTicketSlug());
        assertEquals("Identified bottlenecks", result.getTitle());
        assertEquals("Found inefficient JPA queries.", result.getBody());
        assertArrayEquals(new String[]{"Spring Boot", "PostgreSQL"}, result.getTechnologies());
        assertEquals(entry.getDate(), result.getDate());
        assertEquals("Public", result.getVisibility());
    }

    @Test
    void toDetailResponseMapsAllFields() {
        Entry entry = Entry.builder()
                .id(443682370L)
                .date(LocalDate.of(2025, 12, 10))
                .title("Identified bottlenecks")
                .body("Found inefficient JPA queries.")
                .technologies(new String[]{"Spring Boot"})
                .visibility("Public")
                .build();

        EntryDetailResponse result = mapper.toDetailResponse(entry);

        assertEquals(443682370L, result.getId());
        assertEquals(entry.getDate(), result.getDate());
        assertEquals(entry.getTitle(), result.getTitle());
        assertEquals(entry.getBody(), result.getBody());
        assertArrayEquals(entry.getTechnologies(), result.getTechnologies());
        assertEquals(entry.getVisibility(), result.getVisibility());
    }

    @Test
    void toDetailResponseReturnsNullWhenEntryIsNull() {
        EntryDetailResponse result = mapper.toDetailResponse(null);
        assertNull(result);
    }
}
