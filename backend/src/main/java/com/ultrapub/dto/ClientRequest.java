package com.ultrapub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClientRequest {

    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "Le téléphone est requis")
    @Size(max = 50, message = "Le téléphone ne peut pas dépasser 50 caractères")
    private String telephone;

    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être valide")
    private String email;

    private String adresse;

    private String societe;
}
