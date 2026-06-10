package com.ultrapub.controller;

import com.ultrapub.dto.ClientRequest;
import com.ultrapub.dto.ClientResponse;
import com.ultrapub.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAll(@RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(clientService.searchClients(search));
        }
        return ResponseEntity.ok(clientService.listClients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClient(id));
    }

    @PostMapping
    public ResponseEntity<ClientResponse> create(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.createClient(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> update(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
