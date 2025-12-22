CREATE TABLE cl_entry (
    id BIGINT NOT NULL,
    ticket_id BIGINT NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255),
    body TEXT,
    technologies TEXT[],
    visibility VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_cl_entry PRIMARY KEY (id),
    CONSTRAINT fk_cl_entry_ticket FOREIGN KEY (ticket_id) REFERENCES cl_ticket (id) ON DELETE CASCADE
);
