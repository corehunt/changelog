package com.changelog.tickets.util;

import com.changelog.common.util.AbstractRandomLongIdGenerator;
import com.changelog.tickets.repository.TicketRepository;
import org.springframework.stereotype.Component;

@Component
public class TicketIdGenerator extends AbstractRandomLongIdGenerator {

    private final TicketRepository ticketRepository;

    public TicketIdGenerator(TicketRepository ticketRepository) {
        super(100_000_000L, 999_999_999L, 10);
        this.ticketRepository = ticketRepository;
    }

    @Override
    protected boolean existsById(long id) {
        return ticketRepository.existsById(id);
    }
}
