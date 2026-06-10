package com.ultrapub.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ClientResponse {
    private Long id;
    private String nom;
    private String telephone;
    private String email;
    private String adresse;
    private String societe;
    private Instant dateCreation;
}
