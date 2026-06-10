package com.ultrapub.dto;

import com.ultrapub.entity.CommandeStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommandeRequest {

    @NotNull(message = "L'identifiant client est requis")
    private Long clientId;

    @NotBlank(message = "Le type de panneau est requis")
    private String typePanneau;

    private String dimensions;

    private String matiere;

    @NotNull(message = "Le prix est requis")
    @Min(value = 0, message = "Le prix doit être positif")
    private Double prix;

    @NotNull(message = "Le statut est requis")
    private CommandeStatus statut;
}
