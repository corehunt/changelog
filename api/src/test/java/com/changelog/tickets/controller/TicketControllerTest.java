package com.changelog.tickets.controller;

import com.changelog.auth.service.JwtService;
import com.changelog.tickets.dto.*;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.service.TicketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TicketController.class)
@WithMockUser
class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TicketService ticketService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getTicketsReturnsTicketsPageResponse() throws Exception {

        TicketSummaryResponse ticket = TicketSummaryResponse.builder()
                .id(1L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        TicketsPageResponse response = TicketsPageResponse.builder()
                .tickets(List.of(ticket))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        when(ticketService.getTickets(any(TicketFilters.class), any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/tickets")
                        .param("status", "ACTIVE")
                        .param("page", "0")
                        .param("size", "10")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.size", is(10)))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.totalPages", is(1)))
                .andExpect(jsonPath("$.tickets[0].id", is(1)))
                .andExpect(jsonPath("$.tickets[0].slug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.tickets[0].status", is("ACTIVE")));
    }

    @Test
    void createTicketPostsAndReturnsCreatedTicketSummary() throws Exception {
        CreateTicketRequest request = new CreateTicketRequest();
        request.setSlug("refactor-reevaluation-processor");
        request.setTitle("Refactor reevaluation processor");
        request.setStatus(TicketStatus.ACTIVE);
        request.setVisibility("Public");
        request.setStartDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"));
        request.setEndDate(null);
        request.setBackground("Background");
        request.setTechnologies(new String[]{"Java", "Spring Boot"});

        TicketSummaryResponse created = TicketSummaryResponse.builder()
                .id(456530599L)
                .slug(request.getSlug())
                .title(request.getTitle())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .build();

        when(ticketService.createTicket(any(CreateTicketRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/tickets")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(456530599)))
                .andExpect(jsonPath("$.slug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.status", is("ACTIVE")));
    }

    @Test
    void getTicketByIdReturnsTicketDetail() throws Exception {
        Long id = 123L;

        TicketDetailResponse response = TicketDetailResponse.builder()
                .id(id)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .visibility("P")
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        when(ticketService.getTicketById(id)).thenReturn(response);

        mockMvc.perform(get("/api/v1/tickets/{id}", id)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.slug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.status", is("ACTIVE")));
    }

    @Test
    void getTicketBySlugReturnsTicketDetail() throws Exception {
        String slug = "refactor-reevaluation-processor";

        TicketDetailResponse response = TicketDetailResponse.builder()
                .id(456530599L)
                .slug(slug)
                .title("Refactor reevaluation processor")
                .status(TicketStatus.COMPLETED)
                .visibility("Public")
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .endDate(OffsetDateTime.parse("2025-12-12T18:00:00Z"))
                .entries(List.of(
                        EntrySummaryResponse.builder()
                                .entryId(443682370L)
                                .ticketName("Refactor reevaluation processor")
                                .ticketSlug(slug)
                                .title("Identified bottlenecks")
                                .body("Found inefficient JPA queries.")
                                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                                .date(OffsetDateTime.parse("2025-12-10T17:30:00Z"))
                                .visibility("Public")
                                .build()
                ))
                .build();

        when(ticketService.getTicketBySlug(slug)).thenReturn(response);

        mockMvc.perform(get("/api/v1/tickets/slug/{slug}", slug)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.entries[0].entryId", is(443682370)))
                .andExpect(jsonPath("$.entries[0].ticketSlug", is("refactor-reevaluation-processor")));
    }

    @Test
    void updateTicketPutsAndReturnsUpdatedTicket() throws Exception {
        Long id = 123L;

        UpdateTicketRequest request = new UpdateTicketRequest();
        request.setSlug("refactor-reevaluation-processor");
        request.setTitle("Refactor reevaluation processor - final");
        request.setStatus(TicketStatus.COMPLETED);
        request.setVisibility("Public");
        request.setStartDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"));
        request.setEndDate(OffsetDateTime.parse("2025-12-12T18:00:00Z"));
        request.setBackground("Updated background");
        request.setTechnologies(new String[]{"Java", "Spring Boot", "PostgreSQL", "Hibernate"});
        request.setLearned("Learned advanced batching strategies.");
        request.setRoadblocksSummary("Some roadblocks.");
        request.setMetricsSummary("Cut from 15m to 30s.");

        TicketDetailResponse response = TicketDetailResponse.builder()
                .id(id)
                .slug(request.getSlug())
                .title(request.getTitle())
                .status(request.getStatus())
                .visibility(request.getVisibility())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .background(request.getBackground())
                .technologies(request.getTechnologies())
                .learned(request.getLearned())
                .roadblocksSummary(request.getRoadblocksSummary())
                .metricsSummary(request.getMetricsSummary())
                .build();

        when(ticketService.updateTicket(eq(id), any(UpdateTicketRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/tickets/{id}", id)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.title", is("Refactor reevaluation processor - final")))
                .andExpect(jsonPath("$.metricsSummary", is("Cut from 15m to 30s.")));
    }

    @Test
    void deleteTicketArchivesAndReturnsNoContent() throws Exception {
        Long id = 123L;
        doNothing().when(ticketService).archiveTicket(id);

        mockMvc.perform(delete("/api/v1/tickets/{id}", id)
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
