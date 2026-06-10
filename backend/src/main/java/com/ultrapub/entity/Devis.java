package com.ultrapub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "devis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Devis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Client client;

    @Column(nullable = false)
    private String typePanneau;

    private String dimensions;

    private String matiere;

    @Column(nullable = false)
    private Double prix;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DevisStatus statut;

    @Column(name = "file_url")
    private String fileUrl;

    @CreationTimestamp
    @Column(name = "date_creation", updatable = false)
    private Instant dateCreation;
}
