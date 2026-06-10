package com.ultrapub.dto;

import com.ultrapub.entity.DevisStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class DevisResponse {
    private Long id;
    private Long clientId;
    private String clientNom;
    private String typePanneau;
    private String dimensions;
    private String matiere;
    private Double prix;
    private String description;
    private DevisStatus statut;
    private String fileUrl;
    private Instant dateCreation;
}
