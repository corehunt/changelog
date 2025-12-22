-- For ticket detail pages (entries by ticket, newest first)
CREATE INDEX idx_cl_entry_ticket_date_desc
    ON cl_entry (ticket_id, date DESC);

-- For dashboard + timeline views (global recent activity)
CREATE INDEX idx_cl_entry_date_desc
    ON cl_entry (date DESC);

-- Visibility filtering (public timelines)
CREATE INDEX idx_cl_entry_visibility
    ON cl_entry (visibility);
