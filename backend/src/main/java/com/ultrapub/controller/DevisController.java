package com.ultrapub.controller;

import com.ultrapub.dto.DevisRequest;
import com.ultrapub.dto.DevisResponse;
import com.ultrapub.dto.QuoteRequest;
import com.ultrapub.service.DevisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devis")
public class DevisController {

    private final DevisService devisService;

    public DevisController(DevisService devisService) {
        this.devisService = devisService;
    }

    @GetMapping
    public ResponseEntity<List<DevisResponse>> getAll() {
        return ResponseEntity.ok(devisService.listDevis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DevisResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(devisService.getDevis(id));
    }

    @PostMapping
    public ResponseEntity<DevisResponse> create(@Valid @RequestBody DevisRequest request) {
        return ResponseEntity.ok(devisService.createDevis(request));
    }

    @PostMapping(value = "/public", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DevisResponse> createPublicQuote(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "budget", required = false) String budget,
            @RequestParam(value = "deadline", required = false) String deadline,
            @RequestParam(value = "service-type", required = false) String serviceType,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        QuoteRequest request = new QuoteRequest();
        request.setNom(name);
        request.setEmail(email);
        request.setTelephone(phone);
        request.setBudget(budget);
        request.setDeadline(deadline);
        request.setServiceType(serviceType);
        request.setMessage(message);
        return ResponseEntity.ok(devisService.createDevisFromQuoteRequestWithFile(request, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DevisResponse> update(@PathVariable Long id, @Valid @RequestBody DevisRequest request) {
        return ResponseEntity.ok(devisService.updateDevis(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        devisService.deleteDevis(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        byte[] pdf = devisService.downloadDevisPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=devis-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
