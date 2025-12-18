package com.changelog.tickets.dto;

import com.changelog.tickets.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketFilters {
    private TicketStatus status;
    private TicketStatus statusNot;
    private String visibility;
}