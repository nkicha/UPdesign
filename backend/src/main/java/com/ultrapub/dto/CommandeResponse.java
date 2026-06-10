package com.ultrapub.dto;

import com.ultrapub.entity.CommandeStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CommandeResponse {
    private Long id;
    private Long clientId;
    private String clientNom;
    private String typePanneau;
    private String dimensions;
    private String matiere;
    private Double prix;
    private CommandeStatus statut;
    private Instant dateCreation;
}
