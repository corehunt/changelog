package com.changelog.tickets.controller;

import com.changelog.auth.service.JwtService;
import com.changelog.tickets.dto.*;
import com.changelog.tickets.model.TicketStatus;
import com.changelog.tickets.service.DashboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
@WithMockUser
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getHomeReturnsDashboardHomeResponse() throws Exception {

        TicketSummaryResponse activeTicket = TicketSummaryResponse.builder()
                .id(456530599L)
                .slug("refactor-reevaluation-processor")
                .title("Refactor reevaluation processor")
                .status(TicketStatus.ACTIVE)
                .startDate(OffsetDateTime.parse("2025-12-10T14:30:00Z"))
                .build();

        EntrySummaryResponse recentEntry = EntrySummaryResponse.builder()
                .entryId(443682370L)
                .ticketName("Refactor reevaluation processor")
                .ticketSlug("refactor-reevaluation-processor")
                .title("Identified bottlenecks")
                .body("Found inefficient JPA queries.")
                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                .date(OffsetDateTime.parse("2025-12-10T17:30:00Z"))
                .visibility("Public")
                .build();

        DashboardMetrics metrics = DashboardMetrics.builder()
                .activeTickets(1)
                .completedTickets(3)
                .logsThisWeek(12)
                .lastUpdate(OffsetDateTime.parse("2025-12-12T18:00:00Z"))
                .build();

        DashboardHomeResponse response = DashboardHomeResponse.builder()
                .activeTickets(List.of(activeTicket))
                .recentEntries(List.of(recentEntry))
                .metrics(metrics)
                .build();

        when(dashboardService.getHomePage()).thenReturn(response);

        mockMvc.perform(get("/api/v1/dashboard/home")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeTickets[0].id", is(456530599)))
                .andExpect(jsonPath("$.activeTickets[0].slug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.activeTickets[0].status", is("ACTIVE")))
                .andExpect(jsonPath("$.recentEntries[0].entryId", is(443682370)))
                .andExpect(jsonPath("$.recentEntries[0].ticketSlug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.metrics.activeTickets", is(1)))
                .andExpect(jsonPath("$.metrics.completedTickets", is(3)))
                .andExpect(jsonPath("$.metrics.logsThisWeek", is(12)))
                .andExpect(jsonPath("$.metrics.lastUpdate", is("2025-12-12T18:00:00Z")));
    }
}
