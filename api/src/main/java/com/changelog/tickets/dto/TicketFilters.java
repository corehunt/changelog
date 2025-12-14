package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TicketFilters {

    private TicketStatus status;
}