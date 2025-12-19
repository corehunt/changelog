package com.changelog.tickets.mapper;

import com.changelog.tickets.dto.TicketDetailResponse;
import com.changelog.tickets.dto.TicketSummaryResponse;
import com.changelog.tickets.model.Ticket;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketMapper {
    //TODO refactor into one abstract mapper
    public TicketDetailResponse toDetailResponse(Ticket ticket) {
        if (ticket == null) {
            return null;
        }

        return TicketDetailResponse.builder()
                .id(ticket.getId())
                .slug(ticket.getSlug())
                .title(ticket.getTitle())
                .status(ticket.getStatus())
                .visibility(ticket.getVisibility())
                .startDate(ticket.getStartDate())
                .endDate(ticket.getEndDate())
                .background(ticket.getBackground())
                .technologies(ticket.getTechnologies())
                .learned(ticket.getLearned())
                .roadblocksSummary(ticket.getRoadblocksSummary())
                .metricsSummary(ticket.getMetricsSummary())
                .build();
    }

    public TicketSummaryResponse toSummary(Ticket ticket) {
        return TicketSummaryResponse.builder()
                .id(ticket.getId())
                .slug(ticket.getSlug())
                .title(ticket.getTitle())
                .background(ticket.getBackground())
                .status(ticket.getStatus())
                .startDate(ticket.getStartDate())
                .endDate(ticket.getEndDate())
                .technologies(ticket.getTechnologies())
                .build();
    }
}
