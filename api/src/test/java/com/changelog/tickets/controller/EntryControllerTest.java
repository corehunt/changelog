package com.changelog.tickets.controller;

import com.changelog.auth.service.JwtService;
import com.changelog.tickets.dto.*;
import com.changelog.tickets.service.EntryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EntryController.class)
@WithMockUser
class EntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EntryService entryService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getEntriesReturnsEntriesPageResponse() throws Exception {
        EntriesPageResponse response = EntriesPageResponse.builder()
                .entries(List.of(
                        EntrySummaryResponse.builder()
                                .entryId(443682370L)
                                .ticketName("Refactor reevaluation processor")
                                .ticketSlug("refactor-reevaluation-processor")
                                .title("Identified bottlenecks in reevaluation job")
                                .body("Found inefficient JPA queries.")
                                .technologies(new String[]{"Spring Boot", "PostgreSQL"})
                                .date(LocalDate.of(2025, 12, 10))
                                .visibility("Public")
                                .build()
                ))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        when(entryService.getEntries(any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/entries").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.size", is(10)))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.totalPages", is(1)))
                .andExpect(jsonPath("$.entries[0].entryId", is(443682370)))
                .andExpect(jsonPath("$.entries[0].ticketSlug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.entries[0].visibility", is("Public")));
    }

    @Test
    void getEntriesHonorsPageAndSizeParams() throws Exception {
        EntriesPageResponse response = EntriesPageResponse.builder()
                .entries(List.of())
                .page(2)
                .size(5)
                .totalElements(0)
                .totalPages(0)
                .build();

        when(entryService.getEntries(any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/entries")
                        .param("page", "2")
                        .param("size", "5")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page", is(2)))
                .andExpect(jsonPath("$.size", is(5)))
                .andExpect(jsonPath("$.totalElements", is(0)));
    }

    @Test
    void createEntryReturnsCreatedEntrySummary() throws Exception {
        CreateEntryRequest request = new CreateEntryRequest();
        request.setTicketId("456530599");
        request.setTitle("Identified bottlenecks");
        request.setBody("Initial analysis of reevaluation job");
        request.setTechnologies(new String[]{"Spring Boot", "Hibernate"});
        request.setDate(LocalDate.of(2025, 12, 10));
        request.setVisibility("Public");

        EntrySummaryResponse created = EntrySummaryResponse.builder()
                .entryId(443682370L)
                .ticketName("Refactor reevaluation processor")
                .ticketSlug("refactor-reevaluation-processor")
                .title(request.getTitle())
                .body(request.getBody())
                .technologies(request.getTechnologies())
                .date(request.getDate())
                .visibility(request.getVisibility())
                .build();

        when(entryService.createEntry(any(CreateEntryRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/entries")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.entryId", is(443682370)))
                .andExpect(jsonPath("$.ticketSlug", is("refactor-reevaluation-processor")))
                .andExpect(jsonPath("$.title", is("Identified bottlenecks")));
    }

    @Test
    void updateEntryReturnsUpdatedEntryDetail() throws Exception {
        Long id = 443682370L;

        UpdateEntryRequest request = new UpdateEntryRequest();
        request.setTitle("Updated title");
        request.setBody("Updated body");
        request.setTechnologies(new String[]{"Spring Boot"});
        request.setDate(LocalDate.of(2025, 12, 10));
        request.setVisibility("Public");

        EntryDetailResponse response = EntryDetailResponse.builder()
                .id(id)
                .title(request.getTitle())
                .body(request.getBody())
                .technologies(request.getTechnologies())
                .date(request.getDate())
                .visibility(request.getVisibility())
                .build();

        when(entryService.updateEntry(eq(id), any(UpdateEntryRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/entries/{id}", id)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.title", is("Updated title")))
                .andExpect(jsonPath("$.visibility", is("Public")));
    }

    @Test
    void deleteEntryReturnsNoContent() throws Exception {
        Long id = 443682370L;

        doNothing().when(entryService).deleteEntry(id);

        mockMvc.perform(delete("/api/v1/entries/{id}", id)
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
