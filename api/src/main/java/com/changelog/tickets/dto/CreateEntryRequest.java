package com.changelog.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEntryRequest {

    @NotBlank
    private String title;
    @NotNull
    private String ticketId;
    private LocalDate date;
    private String body;
    private String visibility;
    private String[] technologies;
}
