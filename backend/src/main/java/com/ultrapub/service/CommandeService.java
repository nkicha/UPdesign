package com.ultrapub.service;

import com.ultrapub.dto.CommandeRequest;
import com.ultrapub.dto.CommandeResponse;
import com.ultrapub.entity.Client;
import com.ultrapub.entity.Commande;
import com.ultrapub.exception.ResourceNotFoundException;
import com.ultrapub.repository.ClientRepository;
import com.ultrapub.repository.CommandeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;

    public CommandeService(CommandeRepository commandeRepository,
                          ClientRepository clientRepository) {
        this.commandeRepository = commandeRepository;
        this.clientRepository = clientRepository;
    }

    public CommandeResponse createCommande(CommandeRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + request.getClientId()));
        Commande commande = Commande.builder()
                .client(client)
                .typePanneau(request.getTypePanneau())
                .dimensions(request.getDimensions())
                .matiere(request.getMatiere())
                .prix(request.getPrix())
                .statut(request.getStatut())
                .build();
        return mapToResponse(commandeRepository.save(commande));
    }

    public CommandeResponse updateCommande(Long id, CommandeRequest request) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec id " + id));
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + request.getClientId()));
        commande.setClient(client);
        commande.setTypePanneau(request.getTypePanneau());
        commande.setDimensions(request.getDimensions());
        commande.setMatiere(request.getMatiere());
        commande.setPrix(request.getPrix());
        commande.setStatut(request.getStatut());
        return mapToResponse(commandeRepository.save(commande));
    }

    public void deleteCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec id " + id));
        commandeRepository.delete(commande);
    }

    public CommandeResponse getCommande(Long id) {
        return commandeRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec id " + id));
    }

    public List<CommandeResponse> listCommandes() {
        return commandeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommandeResponse mapToResponse(Commande commande) {
        return CommandeResponse.builder()
                .id(commande.getId())
                .clientId(commande.getClient().getId())
                .clientNom(commande.getClient().getNom())
                .typePanneau(commande.getTypePanneau())
                .dimensions(commande.getDimensions())
                .matiere(commande.getMatiere())
                .prix(commande.getPrix())
                .statut(commande.getStatut())
                .dateCreation(commande.getDateCreation())
                .build();
    }
}
