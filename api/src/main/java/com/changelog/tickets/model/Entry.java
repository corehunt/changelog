package com.changelog.tickets.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "cl_entry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "ticket")
public class Entry {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "date", nullable = false)
    private OffsetDateTime date;

    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "body", columnDefinition = "text")
    private String body;

    @Column(name = "technologies", columnDefinition = "text[]")
    private String[] technologies;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}