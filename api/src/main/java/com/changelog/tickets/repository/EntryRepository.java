package com.changelog.tickets.repository;

import com.changelog.tickets.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface EntryRepository extends JpaRepository<Entry, Long> {

    long countByDateAfter(OffsetDateTime date);

    List<Entry> findByTicketIdOrderByDateAsc(Long ticketId);
}
