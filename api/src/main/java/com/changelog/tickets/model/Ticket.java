package com.changelog.tickets.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cl_ticket")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "entries")
public class Ticket {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TicketStatus status;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "end_date")
    private OffsetDateTime endDate;

    @Column(name = "background", columnDefinition = "text")
    private String background;

    @Column(name = "technologies", columnDefinition = "text[]")
    private String[] technologies;

    @Column(name = "learned", columnDefinition = "text")
    private String learned;

    @Column(name = "roadblocks_summary", columnDefinition = "text")
    private String roadblocksSummary;

    @Column(name = "metrics_summary", columnDefinition = "text")
    private String metricsSummary;

    @Column(name = "visibility", nullable = false)
    private String visibility;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Builder.Default
    @OneToMany(
            mappedBy = "ticket",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Entry> entries = new ArrayList<>();

    public void addEntry(Entry entry) {
        entries.add(entry);
        entry.setTicket(this);
    }

    public void removeEntry(Entry entry) {
        entries.remove(entry);
        entry.setTicket(null);
    }
}