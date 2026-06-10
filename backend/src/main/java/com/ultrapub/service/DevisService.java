package com.ultrapub.service;

import com.ultrapub.dto.DevisRequest;
import com.ultrapub.dto.DevisResponse;
import com.ultrapub.dto.QuoteRequest;
import com.ultrapub.entity.Client;
import com.ultrapub.entity.Devis;
import com.ultrapub.entity.DevisStatus;
import com.ultrapub.entity.Commande;
import com.ultrapub.entity.CommandeStatus;
import com.ultrapub.exception.ResourceNotFoundException;
import com.ultrapub.repository.ClientRepository;
import com.ultrapub.repository.DevisRepository;
import com.ultrapub.repository.CommandeRepository;
import com.ultrapub.utils.PdfGeneratorUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DevisService {

    private final DevisRepository devisRepository;
    private final ClientRepository clientRepository;
    private final CommandeRepository commandeRepository;
    private final PdfGeneratorUtil pdfGeneratorUtil;

    public DevisService(DevisRepository devisRepository,
                        ClientRepository clientRepository,
                        CommandeRepository commandeRepository,
                        PdfGeneratorUtil pdfGeneratorUtil) {
        this.devisRepository = devisRepository;
        this.clientRepository = clientRepository;
        this.commandeRepository = commandeRepository;
        this.pdfGeneratorUtil = pdfGeneratorUtil;
    }

    public DevisResponse createDevis(DevisRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + request.getClientId()));
        Devis devis = Devis.builder()
                .client(client)
                .typePanneau(request.getTypePanneau())
                .dimensions(request.getDimensions())
                .matiere(request.getMatiere())
                .prix(request.getPrix())
                .description(request.getDescription())
                .statut(request.getStatut())
                .build();
        Devis saved = devisRepository.save(devis);
        pdfGeneratorUtil.generateDevisPdf(saved);

        if (saved.getStatut() == DevisStatus.VALIDE) {
            Commande commande = Commande.builder()
                    .client(client)
                    .typePanneau(saved.getTypePanneau())
                    .dimensions(saved.getDimensions())
                    .matiere(saved.getMatiere())
                    .prix(saved.getPrix())
                    .statut(CommandeStatus.EN_ATTENTE)
                    .devisId(saved.getId())
                    .build();
            commandeRepository.save(commande);
        }

        return mapToResponse(saved);
    }

    public DevisResponse createDevisFromQuoteRequest(QuoteRequest request) {
        Client savedClient = clientRepository.findByEmailIgnoreCase(request.getEmail())
                .map(existingClient -> {
                    if (request.getNom() != null && !request.getNom().isBlank()) {
                        existingClient.setNom(request.getNom());
                    }
                    if (request.getTelephone() != null && !request.getTelephone().isBlank()) {
                        existingClient.setTelephone(request.getTelephone());
                    }
                    return clientRepository.save(existingClient);
                })
                .orElseGet(() -> {
                    Client client = Client.builder()
                            .nom(request.getNom())
                            .email(request.getEmail())
                            .telephone(request.getTelephone())
                            .build();
                    return clientRepository.save(client);
                });

        Double prix = parseBudget(request.getBudget());

        Devis devis = Devis.builder()
                .client(savedClient)
                .typePanneau(request.getServiceType() != null ? request.getServiceType() : "Demande de devis")
                .dimensions(request.getDeadline())
                .matiere(null)
                .prix(prix)
                .description(String.format("%s%s",
                        request.getMessage() != null ? request.getMessage() : "",
                        request.getDeadline() != null ? "\nDélai souhaité : " + request.getDeadline() : ""))
                .statut(DevisStatus.EN_ATTENTE)
                .build();

        Devis saved = devisRepository.save(devis);
        pdfGeneratorUtil.generateDevisPdf(saved);
        return mapToResponse(saved);
    }

    public DevisResponse createDevisFromQuoteRequestWithFile(QuoteRequest request, org.springframework.web.multipart.MultipartFile file) {
        Client savedClient = clientRepository.findByEmailIgnoreCase(request.getEmail())
                .map(existingClient -> {
                    if (request.getNom() != null && !request.getNom().isBlank()) {
                        existingClient.setNom(request.getNom());
                    }
                    if (request.getTelephone() != null && !request.getTelephone().isBlank()) {
                        existingClient.setTelephone(request.getTelephone());
                    }
                    return clientRepository.save(existingClient);
                })
                .orElseGet(() -> {
                    Client client = Client.builder()
                            .nom(request.getNom())
                            .email(request.getEmail())
                            .telephone(request.getTelephone())
                            .build();
                    return clientRepository.save(client);
                });

        Double prix = parseBudget(request.getBudget());

        String savedFileUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
                if (!java.nio.file.Files.exists(uploadDir)) {
                    java.nio.file.Files.createDirectories(uploadDir);
                }
                
                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = java.util.UUID.randomUUID().toString() + fileExtension;
                java.nio.file.Path filePath = uploadDir.resolve(uniqueFilename);
                
                java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                savedFileUrl = "/uploads/" + uniqueFilename;
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        Devis devis = Devis.builder()
                .client(savedClient)
                .typePanneau(request.getServiceType() != null ? request.getServiceType() : "Demande de devis")
                .dimensions(request.getDeadline())
                .matiere(null)
                .prix(prix)
                .description(String.format("%s%s",
                        request.getMessage() != null ? request.getMessage() : "",
                        request.getDeadline() != null ? "\nDélai souhaité : " + request.getDeadline() : ""))
                .statut(DevisStatus.EN_ATTENTE)
                .fileUrl(savedFileUrl)
                .build();

        Devis saved = devisRepository.save(devis);
        pdfGeneratorUtil.generateDevisPdf(saved);
        return mapToResponse(saved);
    }

    private Double parseBudget(String budget) {
        if (budget == null || budget.isBlank()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(budget.replaceAll("[^\\d.,]", "").replace(',', '.'));
        } catch (NumberFormatException ex) {
            return 0.0;
        }
    }

    public DevisResponse updateDevis(Long id, DevisRequest request) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec id " + id));
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id " + request.getClientId()));
        
        DevisStatus oldStatus = devis.getStatut();
        
        devis.setClient(client);
        devis.setTypePanneau(request.getTypePanneau());
        devis.setDimensions(request.getDimensions());
        devis.setMatiere(request.getMatiere());
        devis.setPrix(request.getPrix());
        devis.setDescription(request.getDescription());
        devis.setStatut(request.getStatut());
        Devis saved = devisRepository.save(devis);
        pdfGeneratorUtil.generateDevisPdf(saved);

        if (oldStatus != DevisStatus.VALIDE && saved.getStatut() == DevisStatus.VALIDE) {
            if (!commandeRepository.existsByDevisId(id)) {
                Commande commande = Commande.builder()
                        .client(client)
                        .typePanneau(saved.getTypePanneau())
                        .dimensions(saved.getDimensions())
                        .matiere(saved.getMatiere())
                        .prix(saved.getPrix())
                        .statut(CommandeStatus.EN_ATTENTE)
                        .devisId(saved.getId())
                        .build();
                commandeRepository.save(commande);
            }
        }

        return mapToResponse(saved);
    }

    public void deleteDevis(Long id) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec id " + id));
        devisRepository.delete(devis);
    }

    public DevisResponse getDevis(Long id) {
        return devisRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec id " + id));
    }

    public List<DevisResponse> listDevis() {
        return devisRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public byte[] downloadDevisPdf(Long id) {
        Devis devis = devisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec id " + id));
        return pdfGeneratorUtil.generateDevisPdf(devis);
    }

    private DevisResponse mapToResponse(Devis devis) {
        return DevisResponse.builder()
                .id(devis.getId())
                .clientId(devis.getClient().getId())
                .clientNom(devis.getClient().getNom())
                .typePanneau(devis.getTypePanneau())
                .dimensions(devis.getDimensions())
                .matiere(devis.getMatiere())
                .prix(devis.getPrix())
                .description(devis.getDescription())
                .statut(devis.getStatut())
                .fileUrl(devis.getFileUrl())
                .dateCreation(devis.getDateCreation())
                .build();
    }
}
