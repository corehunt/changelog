package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CreateTicketRequest {

    @NotBlank
    private String title;
    private String slug;
    @NotNull
    private TicketStatus status;
    private String visibility;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String background;
    private String[] technologies;

}
