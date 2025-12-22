ALTER TABLE cl_ticket
    ADD CONSTRAINT chk_cl_ticket_visibility
        CHECK (visibility IN ('Public', 'Private'));
