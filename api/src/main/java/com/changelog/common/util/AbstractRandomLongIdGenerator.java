package com.changelog.common.util;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Generic random long ID generator with collision checking.
 * Subclasses only need to implement existsById and optionally tune the range.
 */
public abstract class AbstractRandomLongIdGenerator {

    private final long min;
    private final long max;
    private final int maxAttempts;

    /**
     * @param min         inclusive lower bound for IDs
     * @param max         inclusive upper bound for IDs
     * @param maxAttempts how many times to try before giving up
     */
    protected AbstractRandomLongIdGenerator(long min, long max, int maxAttempts) {
        if (min <= 0 || max <= min) {
            throw new IllegalArgumentException("Invalid ID range: min=" + min + ", max=" + max);
        }
        this.min = min;
        this.max = max;
        this.maxAttempts = maxAttempts;
    }

    /**
     * Return true if the ID already exists for the given entity type.
     */
    protected abstract boolean existsById(long id);

    /**
     * Generate a unique random ID within [min, max], checking for collisions
     * using existsById.
     */
    public long generateId() {
        for (int i = 0; i < maxAttempts; i++) {
            long candidate = ThreadLocalRandom.current().nextLong(min, max + 1);
            if (!existsById(candidate)) {
                return candidate;
            }
        }

        throw new IllegalStateException("Could not generate unique ID after " + maxAttempts + " attempts");
    }
}