-- Filter by status (dashboard, admin views)
CREATE INDEX idx_cl_ticket_status
    ON cl_ticket (status);

-- Find by slug (individual and admin views)
CREATE INDEX idx_cl_ticket_slug
    ON cl_ticket (slug);

-- Timeline / ordering / dashboard sorting
CREATE INDEX idx_cl_ticket_start_date
    ON cl_ticket (start_date DESC);

-- Common combined filter + sort
CREATE INDEX idx_cl_ticket_status_start_date
    ON cl_ticket (status, start_date DESC);

-- Visibility filtering (public/private views)
CREATE INDEX idx_cl_ticket_visibility
    ON cl_ticket (visibility);
