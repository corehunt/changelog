CREATE TABLE cl_ticket (
    id BIGINT NOT NULL,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    background TEXT,
    technologies TEXT[],
    learned TEXT,
    roadblocks_summary TEXT,
    metrics_summary TEXT,
    visibility VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_cl_ticket PRIMARY KEY (id),
    CONSTRAINT uq_cl_ticket_slug UNIQUE (slug)
);
