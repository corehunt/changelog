package com.changelog.tickets.controller;

import com.changelog.auth.service.JwtService;
import com.changelog.tickets.dto.TicketDetailResponse;
import com.changelog.tickets.dto.UpdateTicketRequest;
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

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;


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
