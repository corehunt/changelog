package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTicketRequest {

    @NotBlank
    private String title;
    private String slug;
    @NotNull
    private TicketStatus status;
    private String visibility;
    private LocalDate startDate;
    private LocalDate endDate;
    private String background;
    private String[] technologies;

}
