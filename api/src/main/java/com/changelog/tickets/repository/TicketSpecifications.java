package com.changelog.tickets.repository;

import com.changelog.tickets.dto.TicketFilters;
import com.changelog.tickets.model.Ticket;
import org.springframework.data.jpa.domain.Specification;

public final class TicketSpecifications {

    private TicketSpecifications() {}

    public static Specification<Ticket> fromFilters(TicketFilters filters) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (filters == null) {
                return predicates;
            }

            if (filters.getStatus() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("status"), filters.getStatus()));
            }

            if (filters.getStatusNot() != null) {
                predicates = cb.and(predicates, cb.notEqual(root.get("status"), filters.getStatusNot()));
            }

            if (filters.getVisibility() != null && !filters.getVisibility().isBlank()) {
                predicates = cb.and(predicates, cb.equal(root.get("visibility"), filters.getVisibility()));
            }

            return predicates;
        };
    }
}
