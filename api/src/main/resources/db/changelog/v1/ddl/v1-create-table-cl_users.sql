CREATE TABLE cl_users (
    user_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_cl_users PRIMARY KEY (user_id),
    CONSTRAINT uq_cl_users_email UNIQUE (email)
);
