package com.changelog.tickets.exception;

public class EntryNotFoundException extends RuntimeException {

    public EntryNotFoundException(Long id) {
        super("Entry with id: " + id + " could not found");
    }
}
