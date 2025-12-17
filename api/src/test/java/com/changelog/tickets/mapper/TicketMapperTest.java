package com.changelog.tickets.mapper;

import com.changelog.tickets.dto.TicketDetailResponse;
import com.changelog.tickets.dto.TicketSummaryResponse;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.model.TicketStatus;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TicketMapperTest {

    private final TicketMapper mapper = new TicketMapper();

    @Test
    void toSummaryMapsAllFields() {
        Ticket ticket = Ticket.builder()
                .id(123L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .visibility("Public")
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        TicketSummaryResponse result = mapper.toSummary(ticket);

        assertEquals(123L, result.getId());
        assertEquals("refactor-reevaluation-processor", result.getSlug());
        assertEquals("Refactor reevaluation processor", result.getTitle());
        assertEquals(TicketStatus.ACTIVE, result.getStatus());
        assertEquals(ticket.getStartDate(), result.getStartDate());
    }

    @Test
    void toDetailResponseMapsAllFields() {
        Ticket ticket = Ticket.builder()
                .id(456L)
                .slug("some-ticket")
                .title("Some ticket")
                .status(TicketStatus.COMPLETED)
                .visibility("Public")
                .startDate(OffsetDateTime.parse("2025-12-01T10:00:00Z"))
                .endDate(OffsetDateTime.parse("2025-12-02T18:00:00Z"))
                .background("Background")
                .technologies(new String[]{"Java", "Spring Boot"})
                .learned("Learned stuff")
                .roadblocksSummary("Roadblocks")
                .metricsSummary("Metrics")
                .build();

        TicketDetailResponse result = mapper.toDetailResponse(ticket);

        assertEquals(ticket.getId(), result.getId());
        assertEquals(ticket.getSlug(), result.getSlug());
        assertEquals(ticket.getTitle(), result.getTitle());
        assertEquals(ticket.getStatus(), result.getStatus());
        assertEquals(ticket.getVisibility(), result.getVisibility());
        assertEquals(ticket.getStartDate(), result.getStartDate());
        assertEquals(ticket.getEndDate(), result.getEndDate());
        assertEquals(ticket.getBackground(), result.getBackground());
        assertArrayEquals(ticket.getTechnologies(), result.getTechnologies());
        assertEquals(ticket.getLearned(), result.getLearned());
        assertEquals(ticket.getRoadblocksSummary(), result.getRoadblocksSummary());
        assertEquals(ticket.getMetricsSummary(), result.getMetricsSummary());
    }

    @Test
    void toDetailResponseReturnsNullWhenTicketIsNull() {
        TicketDetailResponse result = mapper.toDetailResponse(null);
        assertNull(result);
    }
}
