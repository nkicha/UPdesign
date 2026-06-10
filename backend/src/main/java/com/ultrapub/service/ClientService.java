package com.ultrapub.service;

import com.ultrapub.dto.ClientRequest;
import com.ultrapub.dto.ClientResponse;
import com.ultrapub.entity.Client;
import com.ultrapub.exception.BadRequestException;
import com.ultrapub.exception.ResourceNotFoundException;
import com.ultrapub.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ClientResponse createClient(ClientRequest request) {
        if (clientRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new BadRequestException("Un client avec cet e-mail existe déjà.");
        }
        Client client = Client.builder()
                .nom(request.getNom())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .adresse(request.getAdresse())
                .societe(request.getSociete())
                .build();
        return mapToResponse(clientRepository.save(client));
    }

    public ClientResponse updateClient(Long id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + id));
        
        clientRepository.findByEmailIgnoreCase(request.getEmail())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("Un client avec cet e-mail existe déjà.");
                    }
                });

        client.setNom(request.getNom());
        client.setTelephone(request.getTelephone());
        client.setEmail(request.getEmail());
        client.setAdresse(request.getAdresse());
        client.setSociete(request.getSociete());
        return mapToResponse(clientRepository.save(client));
    }

    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + id));
        clientRepository.delete(client);
    }

    public ClientResponse getClient(Long id) {
        return clientRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + id));
    }

    public List<ClientResponse> listClients() {
        return clientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ClientResponse> searchClients(String term) {
        List<Client> byName = clientRepository.findByNomContainingIgnoreCase(term);
        List<Client> byEmail = clientRepository.findByEmailContainingIgnoreCase(term);
        return Stream.concat(byName.stream(), byEmail.stream())
                .distinct()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClientResponse mapToResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .nom(client.getNom())
                .telephone(client.getTelephone())
                .email(client.getEmail())
                .adresse(client.getAdresse())
                .societe(client.getSociete())
                .dateCreation(client.getDateCreation())
                .build();
    }
}
