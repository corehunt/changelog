package com.changelog.tickets.service;

import com.changelog.tickets.dto.*;
import com.changelog.tickets.exception.EntryNotFoundException;
import com.changelog.tickets.exception.TicketNotFoundException;
import com.changelog.tickets.mapper.EntryMapper;
import com.changelog.tickets.model.Entry;
import com.changelog.tickets.model.Ticket;
import com.changelog.tickets.repository.EntryRepository;
import com.changelog.tickets.repository.TicketRepository;
import com.changelog.tickets.util.EntryIdGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {

    private final EntryRepository entryRepository;
    private final TicketRepository ticketRepository;
    private final EntryIdGenerator entryIdGenerator;
    private final EntryMapper entryMapper;

    @Override
    @Transactional
    public EntriesPageResponse getEntries(Pageable pageable) {

        Page<Entry> page;

        page = entryRepository.findAll(pageable);

        List<EntrySummaryResponse> summaries = page.getContent().stream()
                .map(entryMapper::toSummary)
                .toList();

        return EntriesPageResponse.builder()
                .entries(summaries)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public EntrySummaryResponse createEntry(CreateEntryRequest request) {
        Ticket ticket = ticketRepository.findById(Long.valueOf(request.getTicketId()))
                .orElseThrow(() -> new TicketNotFoundException(Long.valueOf(request.getTicketId())));

        Entry entry = Entry.builder()
                .id(entryIdGenerator.generateId())
                .ticket(ticket)
                .date(request.getDate())
                .title(request.getTitle())
                .body(request.getBody())
                .technologies(request.getTechnologies())
                .visibility(request.getVisibility())
                .build();

        Entry savedEntry = entryRepository.save(entry);

        return entryMapper.toSummary(savedEntry);
    }

    @Override
    @Transactional
    public EntryDetailResponse updateEntry(Long id, UpdateEntryRequest request) {
        Entry entry = entryRepository.findById(id).orElseThrow(() -> new EntryNotFoundException(id));

        entry.setTitle(request.getTitle());
        entry.setDate(request.getDate());
        entry.setBody(request.getBody());
        entry.setTechnologies(request.getTechnologies());
        entry.setVisibility(request.getVisibility());

        Entry savedEntry = entryRepository.save(entry);

        return entryMapper.toDetailResponse(savedEntry);
    }

    public void deleteEntry(Long id) {
        Entry entry = entryRepository.findById(id).orElseThrow(() -> new EntryNotFoundException(id));

        entryRepository.delete(entry);
    }

}
