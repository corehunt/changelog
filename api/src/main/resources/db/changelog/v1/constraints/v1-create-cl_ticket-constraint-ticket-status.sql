ALTER TABLE cl_ticket
    ADD CONSTRAINT chk_cl_ticket_status
        CHECK (status IN ('ACTIVE', 'COMPLETED', 'ARCHIVED'));