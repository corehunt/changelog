package com.changelog.tickets.util;

import com.changelog.common.util.AbstractRandomLongIdGenerator;
import com.changelog.tickets.repository.EntryRepository;
import org.springframework.stereotype.Component;

@Component
public class EntryIdGenerator extends AbstractRandomLongIdGenerator {

    private final EntryRepository entryRepository;

    public EntryIdGenerator(EntryRepository entryRepository) {
        super(100_000_000L, 999_999_999L, 10);
        this.entryRepository = entryRepository;
    }

    @Override
    protected boolean existsById(long id) {
        return entryRepository.existsById(id);
    }
}
